import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';

const UploadRecipeStep2 = () => {
    const navigate = useNavigate();
    const {
        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient
    } = useRecipe();

    const handleNext = () => {
        // Validation: Ensure at least one ingredient has a name
        const hasValidIngredient = ingredients.some(ing => ing.name.trim() !== '');
        if (!hasValidIngredient) {
            alert('Mohon tambahkan setidaknya satu bahan.');
            return;
        }
        navigate('/upload-recipe/step-3');
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateIngredient(index, 'imagePreview', reader.result);
                updateIngredient(index, 'imageFile', file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Secondary Header / Action Bar */}
            <div className="sticky top-0 z-20 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark py-3">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-all size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">Upload Resep</h2>
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center py-6 px-4 w-full max-w-3xl mx-auto">
                <div className="w-full mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-text-main dark:text-white text-lg font-bold leading-normal">Langkah 2: Bahan-bahan</p>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal">2 dari 3</p>
                        </div>
                        <div className="relative w-full h-2 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out" style={{ width: '66.66%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mt-1 px-1">
                            <span className="text-primary font-bold">Info Dasar</span>
                            <span className="text-primary font-bold">Bahan-bahan</span>
                            <span className="">Langkah & Media</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1 text-left">
                            <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Bahan-bahan</h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Tuliskan semua bahan yang dibutuhkan. Anda juga bisa menambahkan foto untuk setiap bahan.</p>
                        </div>

                        <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">

                            {/* Ingredients List Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 mb-2 text-sm font-bold text-text-secondary px-2">
                                <div className="col-span-6">Nama Bahan</div>
                                <div className="col-span-4">Jumlah / Unit</div>
                                <div className="col-span-2 text-center">Aksi</div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {ingredients.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group relative">
                                        <div className="md:col-span-6">
                                            <label className="md:hidden text-sm font-bold text-text-secondary mb-1 block">Nama Bahan</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded-xl text-text-main dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 border border-border-light md:border-border-light dark:border-border-dark bg-white md:bg-background-light dark:bg-background-dark focus:border-primary h-10 px-3 text-sm transition-all outline-none shadow-sm md:shadow-none pr-10"
                                                    placeholder="Contoh: Tepung Terigu"
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                                />
                                                {item.imagePreview && (
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-md overflow-hidden border border-border-light">
                                                        <img src={item.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className="md:hidden text-sm font-bold text-text-secondary mb-1 block">Jumlah</label>
                                            <input
                                                className="w-full rounded-xl text-text-main dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 border border-border-light md:border-border-light dark:border-border-dark bg-white md:bg-background-light dark:bg-background-dark focus:border-primary h-10 px-3 text-sm transition-all outline-none shadow-sm md:shadow-none"
                                                placeholder="Contoh: 500 gr"
                                                type="text"
                                                value={item.quantity}
                                                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center justify-end md:justify-center gap-2 mt-2 md:mt-0">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    className={`p-2 rounded-lg transition-colors ${item.imagePreview ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/10'}`}
                                                    title="Upload foto bahan"
                                                >
                                                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => handleImageChange(index, e)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus"
                                                disabled={ingredients.length === 1}
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addIngredient}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary/5 hover:border-primary transition-all text-sm"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Tambah Bahan Lain
                            </button>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main dark:text-white font-bold hover:bg-background-light dark:hover:bg-background-dark transition-colors text-sm">
                                        Simpan Draft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-sm"
                                    >
                                        Lanjut ke Langkah 3
                                        <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadRecipeStep2;
