import { supabase } from './supabaseClient';

/**
 * Fetch meal plans for a given date range
 * @param {string} userId 
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
export async function fetchMealPlans(userId, startDate, endDate) {
    if (!userId) return {};

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // 1. Fetch plans within range
    const { data: plans, error } = await supabase
        .from('meal_plans')
        .select(`
            id,
            plan_date,
            meal_plan_items (
                id,
                meal_type,
                recipe_id,
                recipes (
                    id,
                    title,
                    main_image_url,
                    recipe_ingredients (count)
                )
            )
        `)
        .eq('user_id', userId)
        .gte('plan_date', startStr)
        .lte('plan_date', endStr);

    if (error) {
        console.error('Error fetching meal plans:', error);
        return {};
    }

    // Transform to Map: key = "YYYY-MM-DD_type", value = Recipe Object
    const planMap = {};
    plans.forEach(plan => {
        const date = plan.plan_date;
        plan.meal_plan_items.forEach(item => {
            if (item.recipes) {
                const key = `${date}_${item.meal_type}`;
                planMap[key] = {
                    id: item.recipes.id,
                    itemId: item.id, // Store item ID for deletion
                    name: item.recipes.title,
                    image: item.recipes.main_image_url || 'https://placehold.co/600x400',
                    // Adding minimal props to match existing UI expectation (optional)
                    portion: 2,
                    time: '30m'
                };
            }
        });
    });

    return planMap;
}

/**
 * Add a recipe to a meal slot
 */
export async function addToMealPlan({ userId, date, slotType, recipeId }) {
    if (!userId || !date || !slotType || !recipeId) return { error: 'Missing params' };

    const dateStr = date.toISOString().split('T')[0];

    try {
        // 1. Ensure meal_plan exists for date
        let { data: plan } = await supabase
            .from('meal_plans')
            .select('id')
            .eq('user_id', userId)
            .eq('plan_date', dateStr)
            .maybeSingle();

        if (!plan) {
            const { data: newPlan, error: createError } = await supabase
                .from('meal_plans')
                .insert({ user_id: userId, plan_date: dateStr })
                .select('id')
                .single();

            if (createError) throw createError;
            plan = newPlan;
        }

        // 2. Insert item
        const { data: item, error: itemError } = await supabase
            .from('meal_plan_items')
            .insert({
                meal_plan_id: plan.id,
                recipe_id: recipeId,
                meal_type: slotType
            })
            .select()
            .single();

        if (itemError) throw itemError;

        return { data: item };

    } catch (error) {
        console.error('Error adding to meal plan:', error);
        return { error };
    }
}

/**
 * Remove an item from meal plan
 */
export async function removeFromMealPlan(itemId) {
    if (!itemId) return { error: 'Missing ID' };

    const { error } = await supabase
        .from('meal_plan_items')
        .delete()
        .eq('id', itemId);

    return { error };
}
