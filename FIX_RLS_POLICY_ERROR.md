# 🚨 FIX: RLS Policy Error "row-level security policy for table recipes"

**Error:** `new row violates row-level security policy for table "recipes"`  
**Penyebab:** RLS policy untuk INSERT belum dibuat  
**Solusi:** Create INSERT policy di Supabase

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Buka Supabase Dashboard
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Ke **SQL Editor** (di sidebar kiri)

### Step 2: Run SQL ini (Copy-Paste)

```sql
-- Step 1: Enable RLS pada table recipes (jika belum)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Step 2: CREATE ALL 6 POLICIES

-- Policy 1: Public can READ published recipes
CREATE POLICY "Recipes published are readable by all"
  ON recipes
  FOR SELECT
  USING (status = 'published');

-- Policy 2: Owner can READ their own recipes (all statuses)
CREATE POLICY "Users can read their own recipes"
  ON recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 3: Owner can INSERT their own recipes ← FIX UNTUK MASALAH ANDA
CREATE POLICY "Users can insert their own recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Owner can UPDATE their draft/pending recipes
CREATE POLICY "Users can edit their own draft/pending recipes"
  ON recipes
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending')
  );

-- Policy 5: Admin can UPDATE status
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

-- Policy 6: Owner can DELETE draft/pending/rejected
CREATE POLICY "Users can delete their own recipes"
  ON recipes
  FOR DELETE
  USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'pending', 'rejected')
  );
```

### Step 3: Klik **RUN** atau Ctrl+Enter

✅ Jika sukses, tidak ada error. Selesai!

---

## 🔍 Verify: Apakah Policy Sudah Ada?

**Di Supabase Dashboard:**
1. Pergi ke **Authentication** → **Policies** (di table recipes)
2. Lihat apakah ada 6 policies
3. Khususnya lihat apakah ada policy untuk **INSERT**

**Atau query di SQL Editor:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'recipes';
```

Harus menunjukkan 6 policies.

---

## ❌ Common Issues & Solutions

### Issue: "Policy already exists"
**Solusi:** Drop yang lama dulu (via Supabase UI), lalu create baru.

### Issue: "User not authenticated"
**Solusi:** Login dulu di aplikasi sebelum coba simpan draft

### Issue: "status column doesn't exist"
**Solusi:** Run migration terlebih dahulu (lihat di RLS_POLICY_AND_STATUS.md)

### Issue: Masih error setelah create policy
**Solusi:**
```sql
-- Cek apakah RLS enabled?
SELECT relname, relrowsecurity FROM pg_class WHERE relname='recipes';
-- Harus return relrowsecurity = true

-- Cek apakah policies ada?
SELECT * FROM pg_policies WHERE tablename='recipes';
-- Harus return 6 rows
```

---

## ✅ After Fixing: Test Flow

### 1. Simpan Draft
```
User klik "Simpan Draft"
         ⬇
publishRecipe(formData, userId, true)
         ⬇
INSERT recipes (status='draft')
         ⬇
RLS Policy 3 checks: auth.uid() = user_id ✅
         ⬇
INSERT SUCCESS ✅
```

### 2. Public Lihat Home
```
User (not logged in) buka home
         ⬇
fetchRecipes() → WHERE status='published'
         ⬇
RLS Policy 1 allows SELECT ✅
         ⬇
Only published recipes shown ✅
```

### 3. Owner Lihat Profil
```
User (logged in) buka profile "Resep Saya"
         ⬇
fetchUserRecipes(userId)
         ⬇
RLS Policy 2 checks: auth.uid() = user_id ✅
         ⬇
All statuses shown (draft, pending, published, rejected) ✅
```

---

## 📋 Step-by-Step Checklist

- [ ] Step 1: Buka Supabase Dashboard
- [ ] Step 2: Ke SQL Editor
- [ ] Step 3: Copy-paste semua 6 policies
- [ ] Step 4: Run (Ctrl+Enter)
- [ ] Step 5: Verify di Authentication → Policies
- [ ] Step 6: Test simpan draft di aplikasi
- [ ] Step 7: Refresh halaman, draft muncul di profile ✅

---

## 🎯 Hasil Expected Setelah Fix

✅ Bisa simpan draft  
✅ Draft muncul di "Resep Saya" tab  
✅ Public tidak lihat draft  
✅ Bookmarks hanya show published  
✅ No more RLS policy errors  

---

## 📞 Still Getting Error?

### Cek database schema dulu:
```sql
-- Check: Apakah status column ada?
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='recipes';
-- Harus ada column: status (type: text)

-- Check: Apakah RLS enabled?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename='recipes';
-- Harus: rowsecurity = true
```

Jika `status` column tidak ada, lihat **MIGRATION** di [RLS_POLICY_AND_STATUS.md](./RLS_POLICY_AND_STATUS.md#database-migration-one-time-setup)

---

**Status:** ✅ Siap fix RLS error  
**Time:** 5-10 menit
