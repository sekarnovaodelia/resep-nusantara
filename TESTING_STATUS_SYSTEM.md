# Status System - TESTING GUIDE

## 🧪 Pre-Deployment Testing

### Prerequisites
- [ ] SQL migration run on Supabase (status column created)
- [ ] RLS policies configured
- [ ] Frontend code updated
- [ ] Test accounts created (user + admin)

---

## 🔍 Test Scenarios

### Scenario 1: Create & Save Draft

**Steps:**
1. Login as regular user
2. Navigate to "Upload Recipe"
3. Fill form (title, description, image)
4. Click "Simpan Draft" button

**Expected Result:**
- Recipe saved with `status = 'draft'`
- Recipe appears in "Resep Saya" tab
- "Draft" badge shown (gray)
- Recipe NOT visible on home page
- User can still edit recipe

**SQL Check:**
```sql
SELECT id, title, status, user_id FROM recipes 
WHERE user_id = '[user_id]' AND status = 'draft';
-- Should return 1 row
```

---

### Scenario 2: Submit Recipe For Review

**Steps:**
1. Login as regular user
2. Create draft recipe (Scenario 1)
3. Click "Publish" button (instead of "Simpan Draft")

**Expected Result:**
- Recipe saved with `status = 'pending'`
- Recipe appears in "Resep Saya" tab
- "Menunggu" badge shown (yellow)
- Recipe NOT visible on home page
- User cannot edit recipe anymore

**SQL Check:**
```sql
SELECT id, title, status FROM recipes 
WHERE user_id = '[user_id]' AND status = 'pending';
-- Should return 1 row
```

---

### Scenario 3: Published Recipes Visible to Public

**Steps:**
1. Admin: Directly update recipe status to 'published' (via SQL for now)
   ```sql
   UPDATE recipes SET status = 'published' WHERE id = '[recipe_id]';
   ```
2. Logout
3. Visit home page as public user

**Expected Result:**
- Published recipe appears on home page
- "Dipublikasikan" badge NOT shown to public
- Recipe searchable
- Recipe has no status badge

**Query Check (as public):**
```javascript
await fetchRecipes();
// Should include published recipe
```

---

### Scenario 4: Draft Recipe Not Visible to Public

**Steps:**
1. Create draft recipe (Scenario 1)
2. Logout
3. Try to access `/recipe/[draft_recipe_id]` directly

**Expected Result:**
- 404 or "Not Found" error (RLS blocks)
- OR redirected to login

**RLS Check:**
```javascript
// As unauthenticated user
const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .eq('id', draftRecipeId)
  .single();
  
// Should error: permission denied OR empty
```

---

### Scenario 5: Owner Can See Own Recipes

**Steps:**
1. Create 4 recipes:
   - 1 Draft (click "Simpan Draft")
   - 1 Pending (click "Publish")
   - 1 Published (admin updates via SQL)
   - 1 Rejected (admin updates via SQL)
2. Visit Profile > "Resep Saya" tab

**Expected Result:**
- All 4 recipes shown
- Badges displayed correctly:
  - Gray "Draft"
  - Yellow "Menunggu"
  - Green "Dipublikasikan"
  - Red "Ditolak"
- Sorted: Draft → Pending → Published → Rejected

**Database Check:**
```sql
SELECT id, title, status FROM recipes 
WHERE user_id = '[user_id]' 
ORDER BY status;
-- Should return 4 rows in order: draft, pending, published, rejected
```

---

### Scenario 6: Bookmarks Only Show Published

**Steps:**
1. Create 2 recipes:
   - 1 Draft
   - 1 Published
2. Bookmark both
3. Visit Profile > "Koleksi" tab

**Expected Result:**
- Only published recipe shown
- Draft recipe NOT shown
- No status badges displayed

**SQL Check:**
```sql
SELECT r.id, r.title, r.status FROM bookmarks b
JOIN recipes r ON b.recipe_id = r.id
WHERE b.user_id = '[user_id]' AND r.status = 'published';
-- Should return 1 row (only published)
```

---

### Scenario 7: Home Page Shows Only Published

**Steps:**
1. Create multiple recipes with different statuses
2. Visit home page
3. Use search function

**Expected Result:**
- Only published recipes appear
- Draft/Pending/Rejected hidden completely
- No status info shown

**Query Verification:**
```javascript
const recipes = await fetchRecipes();
recipes.forEach(r => {
  console.assert(r.status === 'published', 
    `Expected published, got ${r.status}`);
});
```

---

### Scenario 8: User Cannot Edit Published Recipe

**Steps:**
1. Publish recipe (admin updates to published)
2. Try to edit it via "Edit Recipe" button

**Expected Result:**
- Edit button disabled OR not shown
- OR error on save attempt

**RLS Check:**
```javascript
const { error } = await supabase
  .from('recipes')
  .update({ title: 'New Title' })
  .eq('id', publishedRecipeId)
  .eq('user_id', userId)
  .single();
  
// Should error: permission denied
```

---

### Scenario 9: User Can Edit Draft/Pending

**Steps:**
1. Create draft recipe
2. Edit it (change title)
3. Click "Simpan Draft"

**Expected Result:**
- Recipe updated successfully
- Changes saved

**Same for Pending status**

---

### Scenario 10: User Cannot Delete Published Recipe

**Steps:**
1. Publish recipe (admin updates to published)
2. Visit recipe detail page
3. Try delete button

**Expected Result:**
- Delete button disabled OR not shown
- OR error on delete attempt

**RLS Check:**
```javascript
const { error } = await supabase
  .from('recipes')
  .delete()
  .eq('id', publishedRecipeId)
  .eq('user_id', userId)
  .single();
  
// Should error: permission denied
```

---

### Scenario 11: User CAN Delete Draft/Pending/Rejected

**Steps:**
1. Create draft recipe
2. Delete it

**Expected Result:**
- Recipe deleted successfully

**Same for Pending and Rejected**

---

## 🔒 RLS Security Tests

### Test 1: Public Cannot Read Draft
```javascript
// As anonymous user
const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .eq('status', 'draft');

// Expected: empty array or error
console.assert(!data || data.length === 0);
```

### Test 2: Public Cannot Read Pending
```javascript
// Same as Test 1 but with 'pending' status
```

### Test 3: Public Cannot Read Rejected
```javascript
// Same as Test 1 but with 'rejected' status
```

### Test 4: Owner CAN Read Own Draft
```javascript
// As authenticated owner
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('id', ownDraftId);

// Expected: recipe returned
console.assert(data && data.length > 0);
```

### Test 5: Owner Cannot Read Others' Draft
```javascript
// As authenticated user A, querying user B's draft
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('id', otherUserDraftId);

// Expected: empty array (RLS blocks)
console.assert(!data || data.length === 0);
```

---

## ✅ Checklist

### Backend Tests
- [ ] Scenario 1: Save Draft
- [ ] Scenario 2: Submit for Review
- [ ] Scenario 4: Draft not public
- [ ] Scenario 5: All statuses visible to owner
- [ ] Scenario 10: Cannot delete published
- [ ] Scenario 11: Can delete draft

### Frontend Tests
- [ ] Scenario 3: Published visible
- [ ] Scenario 6: Bookmarks only published
- [ ] Scenario 7: Home shows only published
- [ ] Scenario 9: Can edit draft/pending

### Security Tests
- [ ] Test 1-5: RLS blocking/allowing
- [ ] Cannot update others' recipes
- [ ] Cannot delete others' recipes

### UI Tests
- [ ] Draft badge color (gray) ✓
- [ ] Pending badge color (yellow) ✓
- [ ] Published badge color (green) ✓
- [ ] Rejected badge color (red) ✓
- [ ] Badges only in "Resep Saya" ✓
- [ ] Sorting order correct ✓
- [ ] No badges in "Koleksi" ✓

---

## 🐛 Troubleshooting

### Issue: Draft recipe visible to public
**Cause:** RLS policy not working or SQL not run  
**Fix:** 
1. Check RLS is ENABLED on recipes table
2. Verify status column exists
3. Run RLS policies again

### Issue: User sees published button but no feedback
**Cause:** Mutation not working or silent error  
**Fix:**
1. Check browser console for errors
2. Verify RLS policies allow INSERT
3. Check user_id matches auth.uid()

### Issue: Badges not showing
**Cause:** Recipe data missing status field  
**Fix:**
1. Verify status column has data
2. Check fetchUserRecipes returns status
3. Inspect React DevTools

### Issue: Sort not working
**Cause:** sortRecipesByStatus not handling all statuses  
**Fix:**
1. Check all 4 statuses in statusOrder object
2. Verify undefined handling (?? 4)
3. Add console.log to debug

---

## 📊 Test Report Template

```
Test Date: ________
Tester: ________
Environment: Development / Staging / Production

PASSED:
- [ ] Scenario 1: Save Draft
- [ ] Scenario 2: Submit for Review
- [ ] ...

FAILED:
- [ ] Issue: ________
  Fix: ________
  
SECURITY:
- [ ] No data leaks observed
- [ ] RLS policies working
- [ ] Access control correct

NOTES:
________
```

---

**Ready to test!** 🚀
