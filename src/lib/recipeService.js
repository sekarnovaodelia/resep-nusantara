import { supabase } from './supabaseClient';

// Simple in-memory cache
const cache = {
    regionsPromise: null, // Singleton promise for regions
    recipes: new Map(), // key: string(params), value: { data, timestamp }
};

const CACHE_TTL = 60000; // 1 minute cache for recipes

/**
 * Upload image to Supabase Storage - recipes bucket
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (e.g., 'main', 'ingredients', 'steps')
 * @returns {Promise<string|null>} - Public URL of uploaded image or null
 */
export async function uploadRecipeImage(file, folder = '') {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log('🔵 Uploading image to recipes bucket:', filePath);

    const { data, error } = await supabase.storage
        .from('recipes')
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false
        });

    if (error) {
        console.error('🔴 Image upload error:', error);
        throw error;
    }

    console.log('✅ Image uploaded:', data);

    const { data: urlData } = supabase.storage
        .from('recipes')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}



/**
 * Fetch all regions from database (Singleton Pattern)
 * @returns {Promise<Array>} - List of regions
 */
export function fetchRegions() {
    // Return existing promise if already fetching or fetched
    if (cache.regionsPromise) {
        return cache.regionsPromise;
    }

    console.log('🔵 Fetching regions...');

    // Assign slice of work to promise cache
    cache.regionsPromise = (async () => {
        const { data, error } = await supabase
            .from('regions')
            .select('*')
            .order('name');

        if (error) {
            console.error('🔴 Error fetching regions:', error);
            cache.regionsPromise = null; // Clear on error to allow retry
            return [];
        }

        console.log('✅ Regions fetched:', data?.length || 0);
        return data || [];
    })();

    return cache.regionsPromise;
}

/**
 * Publish/save recipe to Supabase
 * @param {Object} recipeData - All recipe data
 * @param {string} userId - User ID
 * @param {boolean} isPublished - Whether to publish or save as draft
 * @returns {Promise<Object>} - Created recipe
 */



/**
 * Publish/save recipe to Supabase
 * @param {Object} recipeData - All recipe data
 * @param {string} userId - User ID
 * @param {boolean} isPublished - Whether to publish or save as draft
 * @returns {Promise<Object>} - Created recipe
 */
export async function publishRecipe(recipeData, userId, isPublished = true) {
    const {
        title,
        description,
        mainImageFile,
        regionId,
        ingredients,
        steps,
        tags = []
    } = recipeData;

    console.log('🔵 Starting publishRecipe...', { title, userId, isPublished });

    try {
        // 1. Upload main image
        let mainImageUrl = null;
        if (mainImageFile) {
            console.log('🔵 Uploading main image...');
            mainImageUrl = await uploadRecipeImage(mainImageFile, 'main');
        }

        // 2. Insert recipe
        console.log('🔵 Inserting recipe...');
        const { data: recipe, error: recipeError } = await supabase
            .from('recipes')
            .insert({
                user_id: userId,
                title,
                description,
                main_image_url: mainImageUrl,
                region_id: regionId || null,
                is_published: isPublished,
            })
            .select()
            .single();

        if (recipeError) {
            console.error('🔴 Recipe insert error:', recipeError);
            throw recipeError;
        }

        const recipeId = recipe.id;
        console.log('✅ Recipe created:', recipeId);

        // 3. Upload & insert ingredients
        const ingredientsToInsert = [];
        for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            if (!ing.name.trim()) continue;

            let imageUrl = null;
            if (ing.imageFile) {
                console.log(`🔵 Uploading ingredient ${i + 1} image...`);
                imageUrl = await uploadRecipeImage(ing.imageFile, 'ingredients');
            }

            ingredientsToInsert.push({
                recipe_id: recipeId,
                name: ing.name.trim(),
                quantity: ing.quantity || null,
                image_url: imageUrl,
                order_index: i
            });
        }

        if (ingredientsToInsert.length > 0) {
            console.log('🔵 Inserting ingredients...', ingredientsToInsert.length);
            const { error: ingError } = await supabase
                .from('recipe_ingredients')
                .insert(ingredientsToInsert);
            if (ingError) {
                console.error('🔴 Ingredients insert error:', ingError);
                throw ingError;
            }
        }

        // 4. Upload & insert steps
        const stepsToInsert = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (!step.description.trim()) continue;

            let imageUrl = null;
            if (step.imageFile) {
                console.log(`🔵 Uploading step ${i + 1} image...`);
                imageUrl = await uploadRecipeImage(step.imageFile, 'steps');
            }

            stepsToInsert.push({
                recipe_id: recipeId,
                step_number: i + 1,
                description: step.description.trim(),
                image_url: imageUrl
            });
        }

        if (stepsToInsert.length > 0) {
            console.log('🔵 Inserting steps...', stepsToInsert.length);
            const { error: stepsError } = await supabase
                .from('recipe_steps')
                .insert(stepsToInsert);
            if (stepsError) {
                console.error('🔴 Steps insert error:', stepsError);
                throw stepsError;
            }
        }

        // 5. Insert tags (if any)
        if (tags.length > 0) {
            console.log('🔵 Inserting tags...', tags.length);
            const tagsToInsert = tags.map(tag => ({
                recipe_id: recipeId,
                tag_name: tag.trim()
            }));

            const { error: tagsError } = await supabase
                .from('recipe_tags')
                .insert(tagsToInsert);
            if (tagsError) {
                console.error('🔴 Tags insert error:', tagsError);
                throw tagsError;
            }
        }

        // Clear cache on new publish
        cache.recipes.clear();

        console.log('✅ Recipe published successfully!');

        // Fan-out notifications to followers (non-blocking)
        try {
            const { notifyFollowersOfUpload } = await import('./interactionService');
            notifyFollowersOfUpload(userId, recipeId);
        } catch (notifError) {
            console.error('⚠️ Fan-out failed:', notifError);
        }

        return recipe;

    } catch (error) {
        console.error('🔴 publishRecipe error:', error);
        throw error;
    }
}

/**
 * Fetch recipes with filters
 * @param {Object} options - Filter options
 * @param {string} [options.searchQuery] - Search query for title/description
 * @param {number} [options.regionId] - Filter by region ID
 * @param {string} [options.userId] - Filter by user ID
 * @param {number} [options.limit] - Limit results
 * @returns {Promise<Array>} - List of recipes
 */
const inflightRequests = new Map();

/**
 * Fetch recipes with filters
 * @param {Object} options - Filter options
 * @param {string} [options.searchQuery] - Search query for title/description
 * @param {number} [options.regionId] - Filter by region ID
 * @param {string} [options.userId] - Filter by user ID
 * @param {number} [options.limit] - Limit results
 * @returns {Promise<Array>} - List of recipes
 */
export async function fetchRecipes({ searchQuery = '', regionId = null, userId = null, limit = 10 } = {}) {
    // Generate cache key
    const cacheKey = JSON.stringify({ searchQuery, regionId, userId, limit });

    // Check cache
    if (cache.recipes.has(cacheKey)) {
        const { data, timestamp } = cache.recipes.get(cacheKey);
        if (Date.now() - timestamp < CACHE_TTL) {
            // console.log('🟢 Returning cached recipes');
            return data;
        }
    }

    // Check in-flight requests
    if (inflightRequests.has(cacheKey)) {
        console.log('🔵 Joining in-flight recipe fetch...');
        return inflightRequests.get(cacheKey);
    }

    console.log('🔵 Fetching recipes with params:', { searchQuery, regionId, userId, limit });

    const fetchPromise = (async () => {
        try {
            let query = supabase
                .from('recipes')
                .select(`
                    *,
                    regions (
                        id,
                        name
                    ),
                    user_profiles:user_id (
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(limit);

            // Apply filters
            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            if (regionId) {
                query = query.eq('region_id', regionId);
            }

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('🔴 Error fetching recipes:', error);
                return [];
            }

            // Update cache
            cache.recipes.set(cacheKey, { data: data || [], timestamp: Date.now() });

            console.log(`✅ Fetched ${data?.length || 0} recipes`);
            return data || [];
        } finally {
            inflightRequests.delete(cacheKey);
        }
    })();

    inflightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
}

/**
 * Toggle bookmark for a recipe
 * @param {string} userId
 * @param {string} recipeId
 * @returns {Promise<boolean>} - True if bookmarked, False if removed
 */
export async function toggleBookmark(userId, recipeId) {
    if (!userId || !recipeId) return false;

    // Check if exists
    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single();

    if (existing) {
        // Remove
        await supabase
            .from('bookmarks')
            .delete()
            .eq('id', existing.id);
        return false;
    } else {
        // Add
        await supabase
            .from('bookmarks')
            .insert({ user_id: userId, recipe_id: recipeId });

        // Note: We do NOT clear cache.recipes here anymore to prevent refetching the main list
        // when a user bookmarks an item. The UI should update optimistically or locally.
        return true;
    }
}

/**
 * Fetch recipes bookmarked by user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchBookmarkedRecipes(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('bookmarks')
        .select(`
            recipe_id,
            recipes (
                *,
                regions (id, name),
                user_profiles:user_id (full_name)
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookmarks:', error);
        return [];
    }

    // Map to return just the recipe objects (flattened)
    return data.map(item => item.recipes).filter(r => r !== null);
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(recipeId, userId) {
    if (!recipeId || !userId) return { error: 'Missing params' };

    // Verify ownership
    const { data: recipe } = await supabase
        .from('recipes')
        .select('user_id, main_image_url')
        .eq('id', recipeId)
        .single();

    if (!recipe) return { error: 'Recipe not found' };
    if (recipe.user_id !== userId) return { error: 'Unauthorized' };

    // Delete DB row (Cascade should handle related tables)
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

    if (error) return { error };

    // Optional: Delete storage images (main image + ingredients + steps)
    // This requires parsing URLs to get paths. Skipping for MVP iteration unless requested.

    return { error: null };
}

/**
 * Get recipe details for editing (includes raw data structure)
 */
export async function getRecipeForEdit(recipeId) {
    const { data: recipe, error } = await supabase
        .from('recipes')
        .select(`
            *,
            recipe_ingredients (*),
            recipe_steps (*),
            recipe_tags (*)
        `)
        .eq('id', recipeId)
        .single();

    if (error) throw error;

    // Transform to match uploading structure
    return {
        ...recipe,
        ingredients: recipe.recipe_ingredients.sort((a, b) => a.order_index - b.order_index),
        steps: recipe.recipe_steps.sort((a, b) => a.step_number - b.step_number),
        tags: recipe.recipe_tags.map(t => t.tag_name)
    };
}
