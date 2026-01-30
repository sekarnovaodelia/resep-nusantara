# 🔗 ROUTE SETUP - Edit Resep

Tambahkan route untuk halaman edit resep di aplikasi React Router Anda.

---

## Option 1: Di `src/main.jsx` (Jika menggunakan createBrowserRouter)

```jsx
import { createBrowserRouter } from 'react-router-dom';
import EditRecipe from './pages/EditRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Home from './pages/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/recipe/:id',
        element: <RecipeDetail />
    },
    {
        path: '/recipe/:id/edit',          // ← NEW ROUTE
        element: <EditRecipe />
    },
    // ... other routes
]);

export default router;
```

---

## Option 2: Di `src/App.jsx` (Jika menggunakan Routes dalam App)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditRecipe from './pages/EditRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Home from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/recipe/:id/edit" element={<EditRecipe />} />  {/* ← NEW */}
                
                {/* ... other routes */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
```

---

## Option 3: Separate Router Config

**File:** `src/router.jsx`
```jsx
import { createBrowserRouter } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Login from './pages/Login';
import UploadRecipe from './pages/UploadRecipe';

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/recipe/:id', element: <RecipeDetail /> },
    { path: '/recipe/:id/edit', element: <EditRecipe /> },  // ← ADD THIS
    { path: '/profile', element: <Profile /> },
    { path: '/community', element: <Community /> },
    { path: '/login', element: <Login /> },
    { path: '/upload-recipe', element: <UploadRecipe /> },
]);
```

**File:** `src/main.jsx`
```jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
```

---

## Navigation Link Examples

### Di halaman detail resep (RecipeDetail.jsx), tambahkan tombol edit:

```jsx
import { Link } from 'react-router-dom';

export default function RecipeDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [recipe, setRecipe] = React.useState(null);

    // ... fetch recipe ...

    return (
        <div>
            {/* Recipe content */}
            
            {/* Edit button - hanya tampil jika user adalah owner dan status bukan published */}
            {user?.id === recipe?.user_id && recipe?.status !== 'published' && (
                <Link 
                    to={`/recipe/${id}/edit`}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-orange-600"
                >
                    ✏️ Edit Resep
                </Link>
            )}
            
            {/* Jika published, tampilkan pesan */}
            {recipe?.status === 'published' && user?.id === recipe?.user_id && (
                <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                    <p className="text-blue-800">Resep sudah dipublikasikan dan tidak bisa diedit.</p>
                </div>
            )}
        </div>
    );
}
```

---

## Profile Page - Tambah Edit Button di Recipe Card

```jsx
// Di Profile.jsx, dalam map recipes:

{(activeTab === 'my_recipes' ? sortRecipesByStatus(myRecipes) : bookmarkedRecipes)
    .map((recipe) => {
        const statusBadge = getStatusBadge(recipe.status);
        return (
            <div key={recipe.id} className="relative group">
                {/* Recipe card */}
                <Link to={`/recipe/${recipe.id}`} className="block">
                    {/* ... existing card content ... */}
                </Link>

                {/* Edit button - hover overlay */}
                {activeTab === 'my_recipes' && recipe.status !== 'published' && (
                    <Link
                        to={`/recipe/${recipe.id}/edit`}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    >
                        <button className="px-4 py-2 bg-white text-primary font-bold rounded-lg">
                            ✏️ Edit
                        </button>
                    </Link>
                )}
            </div>
        );
    })}
```

---

## Protected Route (Optional)

Jika ingin protect route agar hanya authenticated user yang bisa akses:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import EditRecipe from './pages/EditRecipe';

function ProtectedRoute({ element }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? element : <Navigate to="/login" />;
}

// Dalam routes:
<Route 
    path="/recipe/:id/edit" 
    element={<ProtectedRoute element={<EditRecipe />} />} 
/>
```

---

## URL Navigation Examples

### Dari komponen:
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();

    const handleEditClick = (recipeId) => {
        navigate(`/recipe/${recipeId}/edit`);
    };

    return (
        <button onClick={() => handleEditClick(recipe.id)}>
            Edit
        </button>
    );
}
```

### Hardcoded link:
```jsx
<Link to="/recipe/123/edit">Edit Resep 123</Link>
```

---

## ✅ Verification Checklist

- [ ] Route `/recipe/:id/edit` ditambahkan
- [ ] Import EditRecipe component dilakukan
- [ ] Tombol edit ada di RecipeDetail page
- [ ] Tombol edit ada di Profile page
- [ ] Edit button hanya tampil untuk owner
- [ ] Edit button hidden jika status = 'published'
- [ ] Bisa klik tombol & navigate ke edit page
- [ ] EditRecipe page load dengan data resep
- [ ] RLS guard working (non-owner redirected)
- [ ] Status guard working (published redirected)

---

**Status:** ✅ Ready to implement  
**Time:** 5-10 menit
