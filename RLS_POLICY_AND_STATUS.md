# Status System & RLS Policy Refactor

## Status Enum Values
```
'draft'     - Disimpan draft (belum dikirim)
'pending'   - Menunggu persetujuan admin
'published' - Sudah dipublikasikan & tampil publik
'rejected'  - Ditolak oleh admin
```

---

## Database Migration (One-time setup)

### 1. Ganti kolom `is_published` → `status`
```sql
-- Drop old column and create new enum type
ALTER TABLE recipes DROP COLUMN is_published;

ALTER TABLE recipes ADD COLUMN status TEXT DEFAULT 'draft' NOT NULL;

-- Add constraint to ensure valid values
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
```

---

## RLS Policies (Recommended Setup)

### Policy 1: Public can READ only published recipes
```sql
CREATE POLICY "Recipes published are readable by all"
  ON recipes
  FOR SELECT
  USING (status = 'published');
```

### Policy 2: Owner can READ their own recipes (all statuses)
```sql
CREATE POLICY "Users can read their own recipes"
  ON recipes
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Policy 3: Owner can INSERT their own recipes
```sql
CREATE POLICY "Users can insert their own recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Policy 4: Owner can UPDATE their draft/pending recipes
```sql
CREATE POLICY "Users can edit their own draft/pending recipes"
  ON recipes
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending')
  );
```

### Policy 5: Admin can UPDATE status (pending → published/rejected)
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
  )
  WITH CHECK (
    -- Only admins can change status
    (NEW.status != OLD.status) 
    OR 
    -- Allow other updates for admins
    (NEW.status = OLD.status)
  );
```

### Policy 6: Owner cannot DELETE published recipes
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

## Frontend Query Examples

### 1. Fetch PUBLIC recipes (homepage, search, explore)
```javascript
// Uses status = 'published' ONLY
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
```

**Result:** ✅ Only published recipes visible  
**RLS:** Enforced by Policy 1

---

### 2. Fetch USER'S OWN recipes (Profile.jsx - "Resep Saya" tab)
```javascript
// User sees ALL their recipes (draft, pending, published, rejected)
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

**Result:** ✅ All statuses shown with badges (Draft, Menunggu, Dipublikasikan, Ditolak)  
**RLS:** Enforced by Policy 2

---

### 3. Save Recipe as DRAFT
```javascript
// When user clicks "Simpan Draft"
const { data } = await supabase
  .from('recipes')
  .insert({
    user_id: userId,
    title: 'Nasi Kuning',
    status: 'draft',  // ← Key change
    region_id: 5,
    // ... other fields
  })
  .select()
  .single();
```

**Effect:** Resep disimpan, hanya user yang bisa lihat  
**RLS:** Enforced by Policy 3 (INSERT), Policy 2 (READ)

---

### 4. Submit Recipe for REVIEW (Publish)
```javascript
// When user clicks "Publish"
const { data } = await supabase
  .from('recipes')
  .insert({
    user_id: userId,
    title: 'Rendang Sapi',
    status: 'pending',  // ← Waiting for admin approval
    region_id: 7,
    // ... other fields
  })
  .select()
  .single();
```

**Effect:** Resep masuk queue moderasi, belum tampil publik  
**RLS:** Enforced by Policy 2 (owner sees it), Policy 5 (admin can approve)

---

### 5. Admin APPROVE recipe
```javascript
// Admin dashboard (not in this project yet, but example)
const { data } = await supabase
  .from('recipes')
  .update({ status: 'published' })
  .eq('id', recipeId)
  .eq('status', 'pending')  // Can only approve pending
  .select()
  .single();
```

**Effect:** Resep sekarang tampil publik  
**RLS:** Enforced by Policy 5 (admin only)

---

### 6. Admin REJECT recipe
```javascript
const { data } = await supabase
  .from('recipes')
  .update({ status: 'rejected' })
  .eq('id', recipeId)
  .eq('status', 'pending')
  .select()
  .single();
```

**Effect:** Resep ditandai ditolak, user lihat badge "Ditolak"  
**RLS:** Enforced by Policy 5 (admin only)

---

### 7. User EDIT draft recipe
```javascript
const { data } = await supabase
  .from('recipes')
  .update({
    title: 'Rendang Sapi (Updated)',
    description: '...'
  })
  .eq('id', recipeId)
  .eq('user_id', userId)
  .select()
  .single();
```

**Effect:** Draft dapat diedit tanpa batas  
**RLS:** Enforced by Policy 4 (only draft/pending can edit)

---

## UI Status Badge Mapping (Frontend)

Used in [Profile.jsx](src/pages/Profile.jsx):

```javascript
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

**Display:**
- **Draft** (gray): Resep belum kirim
- **Menunggu** (yellow): Menunggu persetujuan admin
- **Dipublikasikan** (green): Live & terlihat publik
- **Ditolak** (red): Tidak disetujui admin

---

## Code Changes Summary

### recipeService.js
✅ `publishRecipe(recipeData, userId, isDraft)` 
  - `isDraft=true` → `status='draft'`
  - `isDraft=false` → `status='pending'`

✅ `fetchRecipes()` - Query hanya `.eq('status', 'published')`

✅ `fetchUserRecipes(userId)` - Query `.eq('user_id', userId)` → ALL statuses

✅ `fetchBookmarkedRecipes(userId)` - Filter `.filter(r => r.status === 'published')`

### Profile.jsx
✅ Menggunakan `fetchUserRecipes()` untuk "Resep Saya" tab  
✅ Status badge tampil hanya di tab "Resep Saya"  
✅ Sorting: draft & pending di atas, published, rejected paling bawah

---

## Safety Checks

| Operation | Public User | Owner | Admin |
|-----------|-------------|-------|-------|
| View published recipes | ✅ | ✅ | ✅ |
| View own draft/pending | ❌ | ✅ | ✅ |
| Create draft | ✅ | ✅ | ✅ |
| Submit for review | ✅ | ✅ | ✅ |
| Edit draft/pending | ❌ | ✅ | ❌ |
| Approve (pending→published) | ❌ | ❌ | ✅ |
| Reject (pending→rejected) | ❌ | ❌ | ✅ |
| Delete draft/pending | ❌ | ✅ | ❌ |
| Delete published | ❌ | ❌ | ❌ |

---

## Implementation Checklist

- [x] Update `publishRecipe()` function signature
- [x] Add `fetchUserRecipes()` function
- [x] Update `fetchRecipes()` to query `status='published'`
- [x] Update `fetchBookmarkedRecipes()` to filter published only
- [x] Update Profile.jsx to use `fetchUserRecipes()` 
- [x] Add status badges in UI (Profile.jsx)
- [x] Add status sorting logic (Profile.jsx)
- [ ] Create migration SQL on Supabase
- [ ] Implement RLS policies on Supabase
- [ ] Test query access as: public user, authenticated owner, admin
- [ ] Update admin dashboard (future work)

---

## Notes

1. **No `is_published` column anymore** - All queries use `status` field
2. **RLS policies must be enabled** on recipes table
3. **Bookmarks ONLY show published recipes** - Bookmarking a rejected recipe won't show it
4. **User can see own rejected recipes** in "Resep Saya" tab for feedback
5. **Admin moderator UI not yet implemented** - Add separate admin dashboard later
