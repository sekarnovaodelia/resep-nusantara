# ✅ TOMBOL EDIT DITAMBAHKAN DI PROFILE

Fitur **Hover Edit Button** sudah ditambahkan di halaman Profile.jsx pada recipe grid!

---

## 🎯 Apa yang Ditambahkan?

### UI/UX
```
Saat user hover di atas recipe card di tab "Resep Saya":
├─ Background menjadi semi-transparent hitam (bg-black/50)
├─ Tombol edit muncul dengan smooth transition
├─ Icon "edit" + text "Edit" atau "Edit & Resubmit"
└─ Klik tombol → Navigate ke halaman edit
```

### Kondisi Tampil
```
✅ Tampil jika:
  - Tab = "Resep Saya" (my_recipes)
  - Status = draft, pending, atau rejected
  - User hover di atas card

❌ TIDAK tampil jika:
  - Tab = "Koleksi" (bookmarkedRecipes)
  - Status = published
  - Mouse tidak hover
```

---

## 📝 Kode yang Ditambahkan

### Wrapper Berubah dari Link ke Div
```jsx
// SEBELUM:
<Link to={`/recipe/${recipe.id}`} className="group flex flex-col gap-2 cursor-pointer">

// SESUDAH:
<div className="group flex flex-col gap-2 relative">
    <Link to={`/recipe/${recipe.id}`} className="flex flex-col gap-2 cursor-pointer">
        {/* Card content */}
    </Link>
    {/* Edit button overlay */}
</div>
```

### Overlay Edit Button
```jsx
{canEdit && (
    <Link
        to={`/recipe/${recipe.id}/edit`}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
    >
        <div className="flex flex-col items-center gap-2">
            <button className="px-4 py-2 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">edit</span>
                Edit
            </button>
            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                {recipe.status === 'rejected' ? 'Edit & Resubmit' : 'Edit Resep'}
            </span>
        </div>
    </Link>
)}
```

### Logic Variable
```jsx
const canEdit = activeTab === 'my_recipes' && recipe.status !== 'published';
```

---

## ✨ Fitur Detail

### 1. Conditional Rendering
```javascript
canEdit = true jika:
- activeTab === 'my_recipes'  ← User sedang lihat tab "Resep Saya"
- recipe.status !== 'published'  ← Status bukan published

Berarti:
✅ Draft → Tombol muncul
✅ Pending → Tombol muncul
✅ Rejected → Tombol muncul
❌ Published → Tombol TIDAK muncul
```

### 2. Hover Animation
```
opacity-0 group-hover:opacity-100 transition-opacity duration-300
→ Smooth fade in saat hover
```

### 3. Smart Labels
```javascript
{recipe.status === 'rejected' ? 'Edit & Resubmit' : 'Edit Resep'}

Menampilkan:
- "Edit & Resubmit" jika status = rejected (user tahu bisa kirim ulang)
- "Edit Resep" untuk draft & pending
```

### 4. Event Handling
```jsx
onClick={(e) => e.stopPropagation()}
→ Prevent bubble ke parent Link
→ Jadi bisa klik edit button tanpa navigate ke detail page
```

---

## 🎨 Visual Preview

```
┌─────────────────────────┐
│ Recipe Card             │
├─────────────────────────┤
│                         │
│   [HOVER AREA]          │  ← Mouse hover di sini
│   Show Image            │
│                         │
│ ┌───────────────────┐   │
│ │ 50% Opacity      │   │ ← Overlay appears
│ │ ┌───────────────┐ │   │
│ │ │ [EDIT] Edit   │ │   │ ← Button dengan icon
│ │ └───────────────┘ │   │
│ │ Edit Resep       │   │ ← Label
│ └───────────────────┘   │
│                         │
├─────────────────────────┤
│ Title                   │
│ ★ Rating                │
└─────────────────────────┘
```

---

## 🧪 Testing Checklist

- [ ] Login dengan akun test
- [ ] Buka Profile page
- [ ] Tab "Resep Saya" terbuka default
- [ ] Hover di atas recipe card (status = draft)
  - [ ] Overlay muncul smooth
  - [ ] Tombol "Edit Resep" terlihat
  - [ ] Background menjadi semi-transparent
- [ ] Klik tombol edit
  - [ ] Navigate ke /recipe/:id/edit
  - [ ] Halaman edit load dengan data
- [ ] Hover di resep dengan status pending
  - [ ] Overlay & tombol muncul
- [ ] Hover di resep dengan status rejected
  - [ ] Overlay & tombol muncul
  - [ ] Label "Edit & Resubmit" terlihat
- [ ] Hover di resep dengan status published
  - [ ] Overlay TIDAK muncul
  - [ ] Hanya lihat recipe card biasa
- [ ] Switch ke tab "Koleksi"
  - [ ] Tombol edit TIDAK muncul (bahkan di bookmark published)
- [ ] Desktop view (lg breakpoint)
  - [ ] Semua berfungsi seperti mobile
- [ ] Mobile view (sm breakpoint)
  - [ ] Tombol cukup besar untuk di-tap

---

## 🔗 Related Files

- [EditRecipe.jsx](./src/pages/EditRecipe.jsx) - Halaman edit resep
- [recipeService.js](./src/lib/recipeService.js) - Fungsi updateRecipe()
- [EDIT_RECIPE_DOCUMENTATION.md](./EDIT_RECIPE_DOCUMENTATION.md) - Dokumentasi lengkap
- [Profile.jsx](./src/pages/Profile.jsx) - File yang dimodifikasi

---

## 📱 How It Works: Flow Diagram

```
User di Profile.jsx
     ↓
Hover recipe card (status = draft/pending/rejected)
     ↓
canEdit = true
     ↓
Overlay muncul (opacity-0 → opacity-100)
     ↓
User klik "Edit Resep"
     ↓
Link navigate ke /recipe/:id/edit
     ↓
EditRecipe page load
     ↓
Form di-populate dengan data
     ↓
User edit & save
     ↓
Kembali ke /recipe/:id
     ↓
Update terlihat di profile
```

---

## 💡 Pro Tips

### Jika ingin customize:

**1. Ubah warna overlay:**
```jsx
className="... bg-black/50 ..."  // ubah opacity: /50 → /30 atau /70
```

**2. Ubah animation speed:**
```jsx
className="... duration-300 ..."  // ubah: duration-300 → duration-200 (lebih cepat)
```

**3. Ubah button style:**
```jsx
className="... bg-white text-primary ..."
// ubah ke: bg-primary text-white (inverse color)
```

**4. Tambah dropdown menu:**
```jsx
<div className="flex gap-2">
    <Link to={`/recipe/${recipe.id}/edit`}>Edit</Link>
    <button onClick={handleDelete}>Delete</button>
</div>
```

---

## ✅ Status: READY

Fitur sudah siap pakai! Cukup:
1. Buka Profile page
2. Hover di atas recipe card (draft/pending/rejected)
3. Klik tombol "Edit Resep"
4. Edit & save

Enjoy! 🚀
