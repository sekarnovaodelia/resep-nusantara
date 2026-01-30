# Status System - Code Examples & Migration Guide

## 📋 Table of Contents
1. [Database Migration](#database-migration)
2. [Updated recipeService.js Functions](#updated-recipeservicejs-functions)
3. [Profile.jsx Integration](#profilejsx-integration)
4. [Query Examples](#query-examples)
5. [RLS Policy Examples](#rls-policy-examples)

---

## Database Migration

### Before (Old System)
```javascript
// OLD - Do NOT use anymore
is_published: boolean (true/false)
```

### After (New System)
```javascript
// NEW - Use this
status: text enum ('draft', 'pending', 'published', 'rejected')
```

### SQL Migration (One-time)
```sql
-- Step 1: Drop the old column
ALTER TABLE recipes DROP COLUMN is_published;

-- Step 2: Add new status column with default
ALTER TABLE recipes ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

-- Step 3: Add constraint for valid values
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

-- (Optional) Set existing recipes to 'published' if migrating from old system
-- UPDATE recipes SET status = 'published' WHERE status IS NULL;
```

---

## Updated recipeService.js Functions

### 1. ✅ publishRecipe() - UPDATED

**Signature:**
```javascript
publishRecipe(recipeData, userId, isDraft = true)
```

**Parameters:**
- `recipeData`: Object dengan title, description, mainImageFile, ingredients, steps, etc.
- `userId`: String (auth.uid)
- `isDraft`: Boolean
  - `true` (default) → Simpan sebagai **'draft'**
  - `false` → Kirim untuk review sebagai **'pending'**

**Usage Examples:**

```javascript
// SAVE AS DRAFT (Tab "Simpan Draft")
const recipe = await publishRecipe(formData, user.id, true);
// Result: status = 'draft' ✅

// SUBMIT FOR REVIEW (Tab "Publish")
const recipe = await publishRecipe(formData, user.id, false);
// Result: status = 'pending' ✅ (waiting admin approval)
```

**Database Insert:**
```javascript
// Internal logic in publishRecipe()
const { data: recipe, error } = await supabase
  .from('recipes')
  .insert({
    user_id: userId,
    title: title,
    status: isDraft ? 'draft' : 'pending',  // ← KEY CHANGE
    region_id: regionId,
    main_image_url: mainImageUrl,
    description: description
  })
  .select()
  .single();
```

---

### 2. ✅ fetchRecipes() - UPDATED

**Purpose:** Fetch PUBLIC resep (untuk homepage, search, explore)

**Signature:**
```javascript
fetchRecipes({ searchQuery = '', regionId = null, userId = null, limit = 10 })
```

**Key Change:**
```javascript
// OLD ❌
.eq('is_published', true)

// NEW ✅
.eq('status', 'published')
```

**Usage:**
```javascript
// Home page - Fetch all published recipes
const recipes = await fetchRecipes({ limit: 20 });
// Result: Only status='published' ✅

// Search - Find published recipes by query
const recipes = await fetchRecipes({ 
  searchQuery: 'nasi kuning',
  limit: 10 
});
// Result: Only published recipes matching "nasi kuning" ✅

// Filter by region - Published recipes only
const recipes = await fetchRecipes({ 
  regionId: 7,
  limit: 15 
});
// Result: Published recipes from region 7 ✅
```

---

### 3. ✨ fetchUserRecipes() - NEW FUNCTION

**Purpose:** Fetch ALL resep milik user (untuk Profile.jsx - "Resep Saya" tab)

**Signature:**
```javascript
fetchUserRecipes(userId)
```

**Returns:** Array dari semua resep user dengan status: draft, pending, published, rejected

**Usage:**
```javascript
import { fetchUserRecipes } from '../lib/recipeService';

// Load all user's recipes for "Resep Saya" tab
const allUserRecipes = await fetchUserRecipes(user.id);

// Result array akan contain:
[
  { id: 1, title: 'Resep A', status: 'draft', ... },
  { id: 2, title: 'Resep B', status: 'pending', ... },
  { id: 3, title: 'Resep C', status: 'published', ... },
  { id: 4, title: 'Resep D', status: 'rejected', ... }
]
```

**Implementation in recipeService.js:**
```javascript
export async function fetchUserRecipes(userId) {
    if (!userId) return [];

    console.log('🔵 Fetching user recipes for userId:', userId);

    const { data, error } = await supabase
        .from('recipes')
        .select(`
            *,
            regions (
                id,
                name
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('🔴 Error fetching user recipes:', error);
        return [];
    }

    console.log(`✅ Fetched ${data?.length || 0} user recipes`);
    return data || [];
}
```

---

### 4. ✅ fetchBookmarkedRecipes() - UPDATED

**Purpose:** Fetch resep yang sudah di-bookmark user (HANYA published)

**Signature:**
```javascript
fetchBookmarkedRecipes(userId)
```

**Key Change:**
```javascript
// OLD ❌
return data.map(item => item.recipes).filter(r => r !== null);

// NEW ✅ - Filter published only
return data
    .map(item => item.recipes)
    .filter(r => r !== null && r.status === 'published');
```

**Usage:**
```javascript
// Profile.jsx - "Koleksi" tab
const bookmarked = await fetchBookmarkedRecipes(user.id);
// Result: Only published recipes that user bookmarked ✅
```

---

## Profile.jsx Integration

### Updated Component

```jsx
// Profile.jsx - Updated useEffect

React.useEffect(() => {
    const loadData = async () => {
        if (user?.id) {
            if (isFetchingStatsRef.current || lastFetchedUserIdRef.current === user.id) {
                return;
            }

            isFetchingStatsRef.current = true;
            lastFetchedUserIdRef.current = user.id;

            try {
                // CHANGE: Use fetchUserRecipes instead of fetchRecipes
                const { fetchUserRecipes } = await import('../lib/recipeService');

                // 1. Fetch ALL user recipes (all statuses)
                const myRecs = await fetchUserRecipes(user.id);
                setMyRecipes(myRecs);

                // 2. Stats...
                const profileStats = await fetchProfileStats(user.id);
                setStats({
                    ...profileStats,
                    recipes: myRecs.length
                });

                // 3. Collection tab...
                if (activeTab === 'collection') {
                    const bookmarked = myRecs.filter(recipe => 
                        bookmarkedRecipeIds.has(recipe.id)
                    );
                    setBookmarkedRecipes(bookmarked);
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            } finally {
                isFetchingStatsRef.current = false;
            }
        }
    };
    loadData();
}, [user, activeTab, fetchProfileStats, bookmarkedRecipeIds]);
```

### Status Badge Display

```jsx
const getStatusBadge = (status) => {
  const statusMap = {
    'draft': { label: 'Draft', color: 'bg-gray-400 text-white' },
    'pending': { label: 'Menunggu', color: 'bg-yellow-400 text-gray-900' },
    'published': { label: 'Dipublikasikan', color: 'bg-green-500 text-white' },
    'rejected': { label: 'Ditolak', color: 'bg-red-500 text-white' }
  };
  return statusMap[status] || { label: status, color: 'bg-gray-400 text-white' };
};
```

### Rendering in Grid

```jsx
{activeTab === 'my_recipes' ? sortRecipesByStatus(myRecipes) : bookmarkedRecipes}
  .map((recipe) => {
    const statusBadge = getStatusBadge(recipe.status);
    return (
      <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
        <div className="relative aspect-square">
          <img src={recipe.main_image_url} />
          
          {/* Status badge - hanya di tab "Resep Saya" */}
          {activeTab === 'my_recipes' && recipe.status && (
            <div className="absolute top-2 right-2">
              <span className={`${statusBadge.color} px-2 py-1 rounded text-[10px] font-bold uppercase`}>
                {statusBadge.label}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  });
```

---

## Query Examples

### ✅ Correct Queries

```javascript
// 1. Fetch PUBLIC recipes
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });

// 2. Fetch USER's OWN recipes (all statuses)
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// 3. Save as DRAFT
const { data } = await supabase
  .from('recipes')
  .insert({
    user_id: userId,
    title: 'My Recipe',
    status: 'draft',
    region_id: 5
  })
  .select()
  .single();

// 4. Submit for REVIEW
const { data } = await supabase
  .from('recipes')
  .insert({
    user_id: userId,
    title: 'My Recipe',
    status: 'pending',
    region_id: 5
  })
  .select()
  .single();
```

### ❌ WRONG Queries (Don't use these!)

```javascript
// ❌ WRONG - is_published doesn't exist anymore!
.eq('is_published', true)

// ❌ WRONG - Don't filter for user with status published
.eq('user_id', userId)
.eq('status', 'published')  // User might have drafts!

// ❌ WRONG - Bookmarked recipes should only show published
// (should filter in fetchBookmarkedRecipes, not in query)
```

---

## RLS Policy Examples

### Recommended RLS Setup

#### Policy 1: Public CAN READ published
```sql
CREATE POLICY "Recipes published are readable by all"
  ON recipes
  FOR SELECT
  USING (status = 'published');
```

#### Policy 2: Owner CAN READ own recipes
```sql
CREATE POLICY "Users can read their own recipes"
  ON recipes
  FOR SELECT
  USING (auth.uid() = user_id);
```

#### Policy 3: User CAN INSERT own recipes
```sql
CREATE POLICY "Users can insert their own recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Policy 4: Owner CAN UPDATE own draft/pending
```sql
CREATE POLICY "Users can edit their own draft/pending recipes"
  ON recipes
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending')
  );
```

#### Policy 5: Admin CAN UPDATE status
```sql
CREATE POLICY "Admins can approve/reject pending recipes"
  ON recipes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );
```

#### Policy 6: Owner CAN DELETE draft/pending
```sql
CREATE POLICY "Users can delete their own recipes"
  ON recipes
  FOR DELETE
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending', 'rejected')
  );
```

---

## Testing Checklist

- [ ] Public user sees only published recipes on home
- [ ] Authenticated user sees draft in "Resep Saya"
- [ ] Authenticated user sees pending with "Menunggu" badge
- [ ] Bookmarks only show published recipes
- [ ] Draft recipe cannot be deleted after published
- [ ] User cannot edit published recipe (RLS blocks)
- [ ] Admin can view pending recipes (with admin dashboard)
- [ ] Admin can approve/reject (status update works)

---

## Summary of Changes

| File | Change |
|------|--------|
| `recipeService.js` | Updated `publishRecipe()`, `fetchRecipes()`, added `fetchUserRecipes()`, updated `fetchBookmarkedRecipes()` |
| `Profile.jsx` | Use `fetchUserRecipes()` instead of `fetchRecipes()`, added status badges + sorting |
| Supabase | Add `status` column, create RLS policies |

**All queries now use `status` field. NEVER use `is_published` again.**
