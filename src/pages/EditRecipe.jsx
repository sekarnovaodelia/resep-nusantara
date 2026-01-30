import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import { getRecipeForEdit, updateRecipe } from '../lib/recipeService';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Form state
    const [recipe, setRecipe] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);

    // Form data
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    
    const [mainImageFile, setMainImageFile] = React.useState(null);
    const [mainImagePreview, setMainImagePreview] = React.useState('');
    const [ingredients, setIngredients] = React.useState([]);
    const [steps, setSteps] = React.useState([]);
    

    // =============== FETCH RECIPE DATA ===============
    React.useEffect(() => {
        const loadRecipe = async () => {
            if (!user || !id) return;

            try {
                setLoading(true);
                const data = await getRecipeForEdit(id);

                // Guard 1: Check ownership
                if (data.user_id !== user.id) {
                    setError('Anda tidak memiliki izin untuk mengedit resep ini');
                    setTimeout(() => navigate('/'), 2000);
                    return;
                }

                // Guard 2: Check status (cannot edit published)
                if (data.status === 'published') {
                    setError('Resep yang sudah dipublikasikan tidak bisa diedit');
                    setTimeout(() => navigate(`/recipe/${id}`), 2000);
                    return;
                }

                // Guard 3: Check status (cannot edit rejected) - Optional
                // You can allow editing rejected recipes to resubmit
                if (data.status === 'rejected') {
                    // Allow editing rejected recipes
                    console.log('⚠️ Editing rejected recipe - user can resubmit');
                }

                // Set form data
                setRecipe(data);
                setTitle(data.title);
                setDescription(data.description || '');
                
                setMainImagePreview(data.main_image_url || '');
                // Map ingredients to include imageFile + imagePreview for UI
                setIngredients(
                    (data.ingredients || []).map(ing => ({
                        name: ing.name || '',
                        quantity: ing.quantity || '',
                        image_url: ing.image_url || null,
                        imageFile: null,
                        imagePreview: ing.image_url || ''
                    }))
                );

                // Map steps to include imageFile + imagePreview for UI
                setSteps(
                    (data.steps || []).map(step => ({
                        description: step.description || '',
                        image_url: step.image_url || null,
                        imageFile: null,
                        imagePreview: step.image_url || ''
                    }))
                );
                

                setError(null);
            } catch (err) {
                console.error('Error loading recipe:', err);
                setError('Gagal memuat resep. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [user, id, navigate]);

    // =============== HANDLE IMAGE CHANGE ===============
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImageFile(file);
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // =============== HANDLE INGREDIENTS ===============
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', image_url: null, imageFile: null, imagePreview: null }]);
    };

    const handleUpdateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...ingredients];
                updated[index].imageFile = file;
                updated[index].imagePreview = reader.result;
                // Keep original image_url for reference
                setIngredients(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    // =============== HANDLE STEPS ===============
    const handleAddStep = () => {
        setSteps([...steps, { description: '', image_url: null, imageFile: null, imagePreview: null }]);
    };

    const handleUpdateStep = (index, field, value) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleStepImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...steps];
                updated[index].imageFile = file;
                updated[index].imagePreview = reader.result;
                setSteps(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    // =============== HANDLE SAVE ===============
    const handleSave = async () => {
        if (!title.trim()) {
            setError('Judul resep tidak boleh kosong');
            return;
        }

        if (ingredients.length === 0) {
            setError('Tambahkan minimal 1 bahan');
            return;
        }

        if (steps.length === 0) {
            setError('Tambahkan minimal 1 langkah');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const updateData = {
                title: title.trim(),
                description: description.trim(),
                // region removed per request
                ingredients: ingredients.map((ing, idx) => ({
                    name: ing.name,
                    quantity: ing.quantity,
                    imageFile: ing.imageFile || null,
                    image_url: ing.image_url || ing.imagePreview || null,
                    order_index: idx
                })),
                steps: steps.map((step, idx) => ({
                    description: step.description,
                    imageFile: step.imageFile || null,
                    image_url: step.image_url || step.imagePreview || null,
                    step_number: idx + 1
                })),
                // tags removed per request
                mainImageFile: mainImageFile,
                // IMPORTANT: Always keep current status (don't change)
                status: recipe.status
            };

            const result = await updateRecipe(id, user.id, updateData, recipe.status);

            setSuccess(true);
            setTimeout(() => {
                navigate(`/recipe/${id}`);
            }, 1500);
        } catch (err) {
            console.error('Error saving recipe:', err);
            
            // Check for specific RLS errors
            if (err.message?.includes('row-level security')) {
                setError('Anda tidak memiliki izin untuk mengedit resep ini');
            } else if (err.message?.includes('status')) {
                setError('Status resep tidak memungkinkan pengeditan');
            } else {
                setError('Gagal menyimpan perubahan. Silakan coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    // =============== HANDLE PUBLISH (DRAFT → PENDING) ===============
    const handlePublish = async () => {
        if (!title.trim() || ingredients.length === 0 || steps.length === 0) {
            setError('Lengkapi semua data sebelum publish');
            return;
        }

        // Only allow publish if current status is draft or rejected
        if (recipe.status !== 'draft' && recipe.status !== 'rejected') {
            setError('Resep sudah dalam status review atau published');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const updateData = {
                title: title.trim(),
                description: description.trim(),
                // region removed per request
                ingredients: ingredients.map((ing, idx) => ({
                    name: ing.name,
                    quantity: ing.quantity,
                    imageFile: ing.imageFile || null,
                    image_url: ing.image_url || ing.imagePreview || null,
                    order_index: idx
                })),
                steps: steps.map((step, idx) => ({
                    description: step.description,
                    imageFile: step.imageFile || null,
                    image_url: step.image_url || step.imagePreview || null,
                    step_number: idx + 1
                })),
                // tags removed per request
                mainImageFile: mainImageFile,
                // Change status from draft/rejected → pending
                status: 'pending'
            };

            const result = await updateRecipe(id, user.id, updateData, 'pending');

            setSuccess(true);
            setRecipe(prev => ({ ...prev, status: 'pending' }));
            setTimeout(() => {
                navigate(`/recipe/${id}`);
            }, 1500);
        } catch (err) {
            console.error('Error publishing recipe:', err);
            setError('Gagal mengirim resep untuk review. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    // =============== RENDER: LOADING ===============
    if (loading) {
        return (
            <div className="layout-container flex justify-center items-center py-8 px-4 flex-1 min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-sub dark:text-gray-400">Memuat resep...</p>
                </div>
            </div>
        );
    }

    // =============== RENDER: ERROR (Ownership / Status Guard) ===============
    if (error && !recipe) {
        return (
            <div className="layout-container flex justify-center items-center py-8 px-4 flex-1 min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                    <h2 className="text-2xl font-bold text-text-main dark:text-white">Akses Ditolak</h2>
                    <p className="text-text-sub dark:text-gray-400 max-w-md">{error}</p>
                    <Link to="/" className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold">
                        Kembali ke Home
                    </Link>
                </div>
            </div>
        );
    }

    // =============== RENDER: EDIT FORM ===============
    return (
        <div className="layout-container flex justify-center py-8 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="flex flex-col gap-6 w-full max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-text-main dark:text-white">Edit Resep</h1>
                        <p className="text-text-sub dark:text-gray-400 mt-1">
                            Status: <span className="font-bold capitalize">{recipe?.status}</span>
                        </p>
                    </div>
                    <Link to={`/recipe/${id}`} className="text-text-sub hover:text-primary">
                        <span className="material-symbols-outlined">close</span>
                    </Link>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="p-4 bg-green-100 border border-green-300 rounded-lg flex gap-3">
                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                        <div>
                            <p className="font-bold text-green-800">Berhasil!</p>
                            <p className="text-sm text-green-700">Perubahan resep telah disimpan.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && recipe && (
                    <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex gap-3">
                        <span className="material-symbols-outlined text-red-600">error</span>
                        <div>
                            <p className="font-bold text-red-800">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Status Warning */}
                {recipe?.status === 'pending' && (
                    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg flex gap-3">
                        <span className="material-symbols-outlined text-yellow-600">info</span>
                        <div>
                            <p className="font-bold text-yellow-800">Menunggu Persetujuan</p>
                            <p className="text-sm text-yellow-700">Resep Anda sedang menunggu persetujuan admin.</p>
                        </div>
                    </div>
                )}

                {/* Form Container */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    {/* Title */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="font-bold text-text-main dark:text-white">Judul Resep</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Rendang Sapi"
                            className="w-full p-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="font-bold text-text-main dark:text-white">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Cerita di balik resep ini..."
                            rows="4"
                            className="w-full p-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Region removed per request */}

                    {/* Main Image */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="font-bold text-text-main dark:text-white">Foto Utama (Opsional)</label>
                        {mainImagePreview && (
                            <img
                                src={mainImagePreview}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-xl"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="w-full p-3 rounded-xl border border-border-light dark:border-border-dark"
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-text-main dark:text-white">Bahan-Bahan</label>
                            <button
                                onClick={handleAddIngredient}
                                className="flex gap-1 items-center text-primary hover:text-orange-600 text-sm font-bold"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Tambah Bahan
                            </button>
                        </div>

                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 border border-border-light dark:border-border-dark rounded-lg">
                                <div className="md:col-span-6 relative">
                                    <input
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                                        placeholder="Nama bahan"
                                        className="w-full p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white outline-none focus:ring-1 focus:ring-primary/50 mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={ing.quantity}
                                        onChange={(e) => handleUpdateIngredient(idx, 'quantity', e.target.value)}
                                        placeholder="Jumlah (contoh: 500g)"
                                        className="w-full p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                    {ing.imagePreview && <img src={ing.imagePreview} className="absolute right-2 top-2 h-8 w-8 rounded object-cover" alt="preview" />}
                                </div>
                                <div className="md:col-span-4"></div>
                                <div className="md:col-span-2 flex gap-2 justify-center">
                                    <div className="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <span className="material-symbols-outlined text-text-secondary">photo_camera</span>
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleIngredientImageChange(idx, e)} />
                                    </div>
                                    <button onClick={() => handleRemoveIngredient(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Steps */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-text-main dark:text-white">Langkah Memasak</label>
                            <button
                                onClick={handleAddStep}
                                className="flex gap-1 items-center text-primary hover:text-orange-600 text-sm font-bold"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Tambah Langkah
                            </button>
                        </div>

                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-2 p-3 border border-border-light dark:border-border-dark rounded-lg">
                                <div className="flex items-center justify-center size-8 bg-primary text-white rounded-full font-bold shrink-0">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                                        placeholder="Deskripsi langkah..."
                                        rows="3"
                                        className="w-full p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-white outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="w-[28%] md:w-[24%]">
                                    <div className="relative aspect-video rounded-xl border-2 border-dashed border-border-light flex items-center justify-center cursor-pointer hover:border-primary/50 bg-background-light dark:bg-background-dark group overflow-hidden">
                                        {step.imagePreview ? (
                                            <img src={step.imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <div className="flex flex-col items-center text-text-secondary"><span className="material-symbols-outlined">add_photo_alternate</span><span className="text-xs">Foto</span></div>
                                        )}
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleStepImageChange(idx, e)} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveStep(idx)}
                                    className="text-red-500 hover:text-red-700 self-start"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="font-bold text-text-main dark:text-white">Tags (dipisahkan koma)</label>
                        {/* Tags removed per request */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-border-light dark:border-border-dark">
                        <button
                            onClick={() => navigate(`/recipe/${id}`)}
                            disabled={saving}
                            className="px-6 py-3 rounded-xl border border-border-light dark:border-border-dark font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Batal
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 shadow-lg shadow-primary/30 flex gap-2 items-center justify-center"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            {!saving && <span className="material-symbols-outlined">save</span>}
                        </button>

                        {/* Publish button only if draft or rejected */}
                        {(recipe?.status === 'draft' || recipe?.status === 'rejected') && (
                            <button
                                onClick={handlePublish}
                                disabled={saving}
                                className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 flex gap-2 items-center justify-center"
                            >
                                {saving ? 'Mengirim...' : 'Kirim untuk Review'}
                                {!saving && <span className="material-symbols-outlined">send</span>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRecipe;
