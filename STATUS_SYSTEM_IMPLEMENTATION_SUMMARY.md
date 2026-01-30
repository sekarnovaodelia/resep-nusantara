# Status System Refactor - IMPLEMENTATION SUMMARY

**Date:** 2026-01-29  
**Scope:** Complete refactor from `is_published` boolean → `status` enum system

---

## 🎯 What Changed

### Old System ❌
```
recipes.is_published = true/false (binary)
```

### New System ✅
```
recipes.status = 'draft' | 'pending' | 'published' | 'rejected' (enum)
```

---

## 📁 Files Modified

### 1️⃣ `src/lib/recipeService.js` - Core Service Layer

#### ✏️ Updated Functions:

**A. publishRecipe(recipeData, userId, isDraft)**
```javascript
// Before: parameter isPublished (boolean)
// After: parameter isDraft (boolean) + sets status based on value

// isDraft = true  → status = 'draft'
// isDraft = false → status = 'pending'
```

**B. fetchRecipes(options)**
```javascript
// Before: .eq('is_published', true)
// After: .eq('status', 'published')

// Purpose: Fetch only published recipes for public pages
```

**C. fetchBookmarkedRecipes(userId)**
```javascript
// Before: No status filtering
// After: .filter(r => r.status === 'published')

// Purpose: Bookmarks only show published recipes
```

#### ✨ New Functions:

**D. fetchUserRecipes(userId)** ← NEW
```javascript
// Purpose: Fetch ALL user's recipes (draft, pending, published, rejected)
// Used in: Profile.jsx - "Resep Saya" tab
// Returns: Array of user's recipes with status info
```

---

### 2️⃣ `src/pages/Profile.jsx` - Profile Page

#### ✏️ Updated Components:

**A. useEffect - Data Loading**
```javascript
// Before: const { fetchRecipes } = await import(...)
// After: const { fetchUserRecipes } = await import(...)

// Change: Now fetches ALL statuses, not just published
```

**B. Helper Function - getStatusBadge()**
```javascript
// NEW: Maps status to UI badge styling
const getStatusBadge = (status) => ({
  'draft': { label: 'Draft', color: 'bg-gray-400 text-white' },
  'pending': { label: 'Menunggu', color: 'bg-yellow-400 text-gray-900' },
  'published': { label: 'Dipublikasikan', color: 'bg-green-500 text-white' },
  'rejected': { label: 'Ditolak', color: 'bg-red-500 text-white' }
})
```

**C. Helper Function - sortRecipesByStatus()**
```javascript
// NEW: Sorts recipes by status priority
// Order: draft/pending (top) → published → rejected (bottom)
```

**D. Recipe Grid Rendering**
```javascript
// Added: Status badge overlay (top-right of thumbnail)
// Only shows: In "Resep Saya" tab (not in "Koleksi")
// Display: Indonesian labels with color coding
```

---

## 📊 Data Flow

### Creating a Recipe

```
User Action: "Simpan Draft" or "Publish"
         ↓
publishRecipe(formData, userId, isDraft?)
         ↓
Database INSERT → status = 'draft' or 'pending'
         ↓
Return recipe with status field
```

### Viewing Recipes

#### Public (Homepage)
```
User visits home
         ↓
fetchRecipes()
         ↓
Query: WHERE status = 'published'
         ↓
Display: Only published recipes
```

#### User Profile (Resep Saya)
```
User visits own profile
         ↓
fetchUserRecipes(userId)
         ↓
Query: WHERE user_id = ? (ALL statuses)
         ↓
Sort: draft/pending → published → rejected
         ↓
Display: With status badges
```

#### User Bookmarks (Koleksi)
```
User visits collection tab
         ↓
fetchBookmarkedRecipes(userId)
         ↓
Query: bookmarks WHERE user_id = ?
         ↓
Filter: Only status = 'published'
         ↓
Display: No badges shown
```

---

## 🔐 Security (RLS Policies)

### Query Access Matrix

| Query | Public | Owner | Admin |
|-------|--------|-------|-------|
| View published | ✅ | ✅ | ✅ |
| View draft/pending own | ❌ | ✅ | ✅ |
| Insert recipes | ✅ | ✅ | ✅ |
| Edit draft/pending | ❌ | ✅ | ❌ |
| Update status | ❌ | ❌ | ✅ |
| Delete draft/pending | ❌ | ✅ | ❌ |

### RLS Policies Required

1. **Public SELECT published**
   ```sql
   SELECT WHERE status = 'published'
   ```

2. **Owner SELECT own recipes**
   ```sql
   SELECT WHERE user_id = auth.uid()
   ```

3. **Owner INSERT own recipes**
   ```sql
   INSERT WHERE user_id = auth.uid()
   ```

4. **Owner UPDATE draft/pending**
   ```sql
   UPDATE WHERE user_id = auth.uid() AND status IN ('draft', 'pending')
   ```

5. **Admin UPDATE status**
   ```sql
   UPDATE WHERE user.role = 'admin'
   ```

6. **Owner DELETE non-published**
   ```sql
   DELETE WHERE user_id = auth.uid() AND status != 'published'
   ```

---

## 🗄️ Database Migration

### SQL Required (One-time)

```sql
-- 1. Drop old column
ALTER TABLE recipes DROP COLUMN is_published;

-- 2. Add new status column
ALTER TABLE recipes ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

-- 3. Add constraint
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

-- 4. Migrate existing data (if applicable)
-- UPDATE recipes SET status = 'published' WHERE ...
```

---

## 🎨 UI Status Badges

### Badge Styling (Tailwind)

| Status | Label | Color | Hex |
|--------|-------|-------|-----|
| draft | Draft | Gray | #9ca3af |
| pending | Menunggu | Yellow/Orange | #facc15 |
| published | Dipublikasikan | Green | #22c55e |
| rejected | Ditolak | Red | #ef4444 |

### Badge Display Rules

- ✅ Show in: "Resep Saya" tab
- ❌ Hide in: "Koleksi" tab
- Position: Top-right overlay
- Size: text-[9px] md:text-[10px]
- Weight: font-bold uppercase

---

## ✅ Implementation Checklist

### Backend/Database
- [x] Update `publishRecipe()` function signature
- [x] Add `fetchUserRecipes()` function
- [x] Update `fetchRecipes()` to query status='published'
- [x] Update `fetchBookmarkedRecipes()` to filter published
- [ ] Run SQL migration on Supabase (MANUAL)
- [ ] Create RLS policies on Supabase (MANUAL)

### Frontend
- [x] Update Profile.jsx to use `fetchUserRecipes()`
- [x] Add `getStatusBadge()` helper
- [x] Add `sortRecipesByStatus()` helper
- [x] Add status badge rendering
- [ ] Test: Public user sees only published
- [ ] Test: Owner sees draft/pending with badges
- [ ] Test: Bookmarks show published only
- [ ] Test: Status sorting works correct

### Future Work
- [ ] Admin dashboard to approve/reject recipes
- [ ] Admin notification system
- [ ] User notification when status changes
- [ ] Analytics for status distribution

---

## 🚀 Next Steps (For Developer)

### Immediate (Must Do)

1. **Backup database**
2. **Run SQL migration** on Supabase recipes table
3. **Create RLS policies** (see RLS_POLICY_AND_STATUS.md)
4. **Test with Supabase Studio:**
   - Create test recipe as draft
   - Verify status='draft' in database
   - Test public query (should not see draft)
   - Test owner query (should see draft)

### Soon (Should Do)

1. **Create admin dashboard** to moderate pending recipes
2. **Add status filter** to recipe list queries
3. **Update RecipeDetail page** to check authorization

### Later (Nice to Have)

1. **Email notifications** when status changes
2. **Batch approve/reject** in admin panel
3. **Status history** / audit log
4. **User appeals** for rejected recipes

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| `RLS_POLICY_AND_STATUS.md` | Complete RLS setup + policy SQL |
| `STATUS_SYSTEM_CODE_EXAMPLES.md` | Code examples + migration guide |
| `STATUS_SYSTEM_IMPLEMENTATION_SUMMARY.md` | This file - overview |

---

## 🔗 Key Changes at a Glance

```diff
// recipeService.js
- is_published: true/false
+ status: 'draft' | 'pending' | 'published' | 'rejected'

- .eq('is_published', true)
+ .eq('status', 'published')

- fetchRecipes({ userId })  // Only public
+ fetchUserRecipes(userId)  // All statuses

- fetchBookmarkedRecipes() // No filtering
+ fetchBookmarkedRecipes() // Filter published only

// Profile.jsx
- Single tab view
+ Status badges in "Resep Saya" tab
+ Status sorting (draft/pending first)
+ Different fetch function
```

---

## ⚠️ Important Notes

1. **NO `is_published` anymore** - This column has been completely replaced
2. **All queries must use `status`** - Any old is_published query will fail
3. **Public queries ONLY published** - Never expose drafts to public
4. **RLS is critical** - Without RLS, security is compromised
5. **Test thoroughly** - Especially permission boundaries
6. **Migration is ONE-TIME** - Cannot be undone without restoring backup

---

**Status: ✅ READY FOR DEPLOYMENT**

All code changes implemented. Database migration and RLS setup must be done on Supabase manually.
