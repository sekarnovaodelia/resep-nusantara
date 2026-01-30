# Status System - QUICK REFERENCE

## 🎯 One-Minute Summary

**Old:** `is_published` boolean (true/false)  
**New:** `status` enum ('draft', 'pending', 'published', 'rejected')

---

## 📱 What Users See

### Tab: "Resep Saya" (My Recipes)
```
Status Badge Appearance:
├─ Draft       → Gray badge (not yet submitted)
├─ Menunggu    → Yellow badge (waiting admin review)
├─ Dipublikasikan → Green badge (live & public)
└─ Ditolak     → Red badge (rejected by admin)

Display Order:
1. Draft recipes (at top)
2. Pending recipes
3. Published recipes
4. Rejected recipes (at bottom)
```

### Tab: "Koleksi" (Bookmarks)
```
Only shows published recipes
No status badges shown
```

### Public Pages (Home, Search, Explore)
```
Only published recipes shown
No status information visible
```

---

## 🔧 For Developers

### Save Recipe As Draft
```javascript
await publishRecipe(formData, userId, true);
// Result: status = 'draft'
```

### Submit Recipe For Review
```javascript
await publishRecipe(formData, userId, false);
// Result: status = 'pending'
```

### Get Public Recipes
```javascript
await fetchRecipes();
// Only: status = 'published'
```

### Get User's All Recipes
```javascript
await fetchUserRecipes(userId);
// Returns: draft, pending, published, rejected
```

### Get User's Bookmarks
```javascript
await fetchBookmarkedRecipes(userId);
// Only: published recipes that are bookmarked
```

---

## 🗄️ Database

### Before Migration
```sql
recipes.is_published BOOLEAN (true/false)
```

### After Migration
```sql
recipes.status TEXT (enum: 'draft', 'pending', 'published', 'rejected')
```

### Migration SQL (COPY TO SUPABASE)
```sql
ALTER TABLE recipes DROP COLUMN is_published;
ALTER TABLE recipes ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
```

---

## 🔐 RLS Rules (Simplified)

| Who | Can Read | Can Create | Can Edit | Can Delete |
|-----|----------|-----------|---------|-----------|
| Public | Published only | - | - | - |
| Owner | Own all | Own recipes | Draft/Pending | Draft/Pending |
| Admin | All | All | All | All |

---

## ❌ DON'T USE

```javascript
// ❌ These are WRONG now:
.eq('is_published', true)
.eq('is_published', false)

// Use this instead:
.eq('status', 'published')
```

---

## ✅ DO USE

```javascript
// ✅ Correct queries:
.eq('status', 'published')        // Public recipes
.eq('user_id', userId)            // User's all recipes
.eq('status', 'draft')            // User's drafts
.eq('status', 'pending')          // Awaiting review
```

---

## 📊 Status Mapping (UI)

```javascript
{
  'draft': {
    label: 'Draft',
    color: 'bg-gray-400 text-white',
    meaning: 'Disimpan, belum dikirim'
  },
  'pending': {
    label: 'Menunggu',
    color: 'bg-yellow-400 text-gray-900',
    meaning: 'Menunggu persetujuan admin'
  },
  'published': {
    label: 'Dipublikasikan',
    color: 'bg-green-500 text-white',
    meaning: 'Sudah live, tampil publik'
  },
  'rejected': {
    label: 'Ditolak',
    color: 'bg-red-500 text-white',
    meaning: 'Ditolak admin'
  }
}
```

---

## 🚀 Deployment Steps

1. **Backup database**
2. **Run SQL migration** on Supabase
3. **Create RLS policies** (see full docs)
4. **Test queries** in Supabase Studio
5. **Deploy frontend** (already updated)

---

## 📖 Full Documentation

- [RLS_POLICY_AND_STATUS.md](./RLS_POLICY_AND_STATUS.md) - Complete RLS guide
- [STATUS_SYSTEM_CODE_EXAMPLES.md](./STATUS_SYSTEM_CODE_EXAMPLES.md) - Code samples
- [STATUS_SYSTEM_IMPLEMENTATION_SUMMARY.md](./STATUS_SYSTEM_IMPLEMENTATION_SUMMARY.md) - Full summary

---

## ⚡ Common Questions

### Q: Can user edit published recipe?
**A:** No - Only draft/pending can be edited (RLS enforced)

### Q: Where's the admin dashboard?
**A:** Not implemented yet - Future work

### Q: Can bookmarks include draft recipes?
**A:** No - Bookmarks only show published (filtered)

### Q: How does admin approve recipes?
**A:** Via RLS policy (pending → published) - Needs admin UI

### Q: What happens if I query old is_published?
**A:** Column doesn't exist - Query will fail - Use status instead

---

**Last Updated:** 2026-01-29  
**Status:** ✅ Ready to Deploy
