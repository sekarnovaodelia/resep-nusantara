# 📝 HALAMAN EDIT RESEP - DOKUMENTASI

**File:** `src/pages/EditRecipe.jsx`  
**Service:** `src/lib/recipeService.js` (fungsi `updateRecipe()`)  
**Route:** `/recipe/:id/edit`

---

## 🎯 Fitur Utama

### 1. Guard Checks (Sebelum Form)
```javascript
// Guard 1: Check ownership
if (data.user_id !== user.id) {
    → Redirect ke home dengan pesan error

// Guard 2: Check status (published tidak bisa edit)
if (data.status === 'published') {
    → Tampilkan error "Sudah dipublikasikan"
    → Redirect ke halaman detail

// Guard 3: Rejected resep boleh di-edit ulang
if (data.status === 'rejected') {
    → Allow dengan warning
```

### 2. Form Fields
```
✅ Judul
✅ Deskripsi
✅ Region ID
✅ Foto utama (optional)
✅ Bahan-bahan (add/remove)
✅ Langkah memasak (add/remove)
✅ Tags
```

### 3. Action Buttons
```
- "Batal" → Kembali ke detail resep
- "Simpan Perubahan" → Update (status tetap sama)
- "Kirim untuk Review" → Update status draft → pending
  (Hanya tampil jika status = draft atau rejected)
```

---

## 📋 RLS Security

### Ownership Check
```javascript
// Frontend guard (optional, RLS is mandatory)
if (data.user_id !== user.id) {
    throw Error('Unauthorized')
}

// Backend RLS (MANDATORY)
Policy 4: "Users can edit their own draft/pending recipes"
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending')
  )
```

### Status Check
```
Cannot edit:
- published (RLS blocks)
- rejected (optional, can allow re-submission)

Can edit:
- draft (yes)
- pending (yes, until admin reviews)
```

### Status Update Rules
```
Frontend → draft/pending ONLY
- Never send status='published'
- Admin sets published via backend

Draft → Pending:
  User klik "Kirim untuk Review"
  status: 'draft' → 'pending'

Pending → Published/Rejected:
  Only admin (not implemented yet)
```

---

## 🔄 Data Flow

### Load Recipe
```
useEffect
  ↓
getRecipeForEdit(recipeId)
  ↓
SELECT * FROM recipes WHERE id=recipeId
  (dengan ingredients, steps, tags)
  ↓
Guard 1: Check user_id = auth.uid()
  ↓
Guard 2: Check status != 'published'
  ↓
Populate form dengan data
```

### Save Changes
```
User klik "Simpan Perubahan"
  ↓
Validate form (title, ingredients, steps required)
  ↓
handleSave()
  ↓
updateRecipe(id, userId, updateData, 'draft')
  ↓
Database:
  1. Check ownership + status via RLS
  2. UPDATE recipes (title, description, etc.)
  3. DELETE old ingredients, re-INSERT new
  4. DELETE old steps, re-INSERT new
  5. DELETE old tags, re-INSERT new
  ↓
Success → Redirect ke /recipe/:id
```

### Publish for Review
```
User klik "Kirim untuk Review"
  ↓
Validate form
  ↓
Check status = 'draft' or 'rejected'
  ↓
handlePublish()
  ↓
updateRecipe(id, userId, updateData, 'pending')
  ↓
Database:
  1. Check ownership + status via RLS
  2. UPDATE recipes (status='pending')
  3. Update ingredients, steps, tags
  ↓
Success → Redirect ke /recipe/:id
```

---

## 🛡️ Error Handling

### RLS Errors
```javascript
if (err.message?.includes('row-level security')) {
    → "Anda tidak memiliki izin untuk mengedit resep ini"
}
```

### Status Errors
```javascript
if (err.message?.includes('status')) {
    → "Status resep tidak memungkinkan pengeditan"
}
```

### Validation Errors
```javascript
if (!title.trim()) {
    → "Judul resep tidak boleh kosong"
}

if (ingredients.length === 0) {
    → "Tambahkan minimal 1 bahan"
}

if (steps.length === 0) {
    → "Tambahkan minimal 1 langkah"
}
```

---

## 📲 Komponen State

### Recipe State (dari DB)
```javascript
recipe: {
  id,
  user_id,
  title,
  description,
  main_image_url,
  region_id,
  status,          // 'draft', 'pending', 'published', 'rejected'
  ingredients: [],
  steps: [],
  tags: []
}
```

### Form State
```javascript
title: string
description: string
regionId: string
mainImageFile: File | null
mainImagePreview: string
ingredients: [{ name, quantity, image_url }, ...]
steps: [{ description, image_url }, ...]
tags: string (comma-separated)
```

### UI State
```javascript
loading: boolean     (initial load)
saving: boolean      (during save/publish)
error: string | null
success: boolean
```

---

## 🔌 Fungsi updateRecipe()

### Signature
```javascript
updateRecipe(recipeId, userId, updateData, newStatus)
```

### Parameters
```javascript
recipeId: string          // Recipe ID
userId: string            // Current user ID (for RLS check)
updateData: {
  title: string,
  description: string,
  regionId: string,
  ingredients: [],
  steps: [],
  tags: [],
  mainImageFile: File | null,
  status: string
}
newStatus: string         // 'draft' or 'pending'
```

### Logic
```
1. Check recipe ownership (RLS enforced)
   if user_id != userId → Throw error
   
2. Check status != 'published' (RLS enforced)
   if status = 'published' → Throw error
   
3. Upload main image if provided
   
4. UPDATE recipes table
   - title, description, region_id
   - main_image_url (if new image)
   - status (newStatus parameter)
   
5. DELETE old ingredients, re-INSERT new
   
6. DELETE old steps, re-INSERT new
   
7. DELETE old tags, re-INSERT new
   
8. Return updated recipe
```

### Return Value
```javascript
{
  id,
  user_id,
  title,
  description,
  main_image_url,
  region_id,
  status,
  created_at,
  updated_at
}
```

### Error Cases
```
❌ "Unauthorized" → User doesn't own recipe
❌ "Cannot edit published" → Status is published
❌ "RLS policy violation" → Supabase RLS blocks
```

---

## 🔗 Route Setup (React Router)

Tambahkan route di App.jsx atau router config:

```jsx
import EditRecipe from './pages/EditRecipe';

// Routes
<Route path="/recipe/:id/edit" element={<EditRecipe />} />
```

---

## 📋 Usage Flow

### User Experience

**Step 1: Open Edit Page**
```
User klik tombol "Edit" di halaman resep
  ↓
Navigasi ke /recipe/:id/edit
  ↓
Halaman load dengan data resep
```

**Step 2: Edit & Save**
```
User ubah judul, bahan, langkah
  ↓
Klik "Simpan Perubahan"
  ↓
Form di-validate
  ↓
Update ke database
  ↓
Success message
  ↓
Redirect ke halaman detail resep
```

**Step 3: Submit for Review (Opsional)**
```
Jika status = draft:
  User klik "Kirim untuk Review"
  ↓
  Status berubah draft → pending
  ↓
  Resep masuk moderasi queue
  ↓
  Admin akan review & approve/reject

Jika status = pending:
  Tombol "Kirim untuk Review" tidak muncul
  (Hanya "Simpan Perubahan")
```

---

## 🧪 Testing Scenarios

### ✅ Test 1: Edit Draft Recipe
```
1. Login as user A
2. Create a draft recipe (atau gunakan existing)
3. Go to /recipe/:id/edit
4. Change title, add ingredient
5. Click "Simpan Perubahan"
6. Verify: Recipe updated, still draft
7. Verify: Changes visible at /recipe/:id
```

### ✅ Test 2: Publish Draft for Review
```
1. Login as user A
2. Open draft recipe edit page
3. Click "Kirim untuk Review"
4. Verify: Status changed to 'pending'
5. Verify: "Kirim untuk Review" button gone
6. Verify: "Simpan Perubahan" button still visible
```

### ✅ Test 3: Cannot Edit Published Recipe
```
1. Admin publishes recipe (or use existing published)
2. Owner tries to go to /recipe/:id/edit
3. Verify: Redirected to home
4. Verify: Error "Resep sudah dipublikasikan"
```

### ✅ Test 4: Cannot Edit Others' Recipe
```
1. Login as user A
2. Try to go to /recipe/:B_RECIPE_ID/edit
3. Verify: Redirected to home
4. Verify: Error "Anda tidak memiliki izin"
```

### ✅ Test 5: RLS Policy Enforcement
```
1. Edit recipe + change status to 'published' in console
2. Try POST to /recipes update endpoint
3. Verify: Supabase RLS blocks (policy error)
```

### ✅ Test 6: Edit Rejected Recipe
```
1. Admin rejects a recipe (set status='rejected')
2. Owner goes to /recipe/:id/edit
3. Verify: Can edit (no ownership block)
4. Verify: Can click "Kirim untuk Review"
5. Verify: Status changes rejected → pending
```

---

## 🎨 UI Status Badges (In Edit Page)

```
Draft:
  <span className="font-bold capitalize">draft</span>
  Status: Draft

Pending:
  <span className="font-bold capitalize">pending</span>
  Status: Pending
  + Warning: "Resep Anda sedang menunggu persetujuan admin"

Rejected:
  <span className="font-bold capitalize">rejected</span>
  Status: Rejected
  (Can re-edit and resubmit)

Published:
  (Cannot access edit page, redirect)
```

---

## 📝 Notes

### Important
- **Never** allow frontend to set status='published'
  - Only admin backend should set this
  - RLS policy enforces this
  
- **Always** include current status in UPDATE query
  - Prevent accidental status changes
  - Example: `UPDATE recipes SET status='draft'`

### Performance
- Image upload happens during save
- No separate upload endpoint needed
- Ingredients/steps deleted & re-inserted (not partial update)
  - Simpler logic, acceptable for MVP

### Future Improvements
- Drag-to-reorder ingredients & steps
- Auto-save draft every N seconds
- Image compression before upload
- Skeleton loading instead of spinner
- Edit history / version control

---

**Status:** ✅ Complete & Ready to Use  
**Last Updated:** 2026-01-29
