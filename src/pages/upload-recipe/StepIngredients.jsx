import React from 'react';
import { useRecipe } from '../../context/RecipeContext';

const StepIngredients = ({ onNext, onBack, onSaveDraft, isPublishing }) => {
    const {
        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient
    } = useRecipe();

    const handleIngredientImageChange = (index, e) => {
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
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-left">
                <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Bahan-bahan</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Tuliskan semua bahan yang dibutuhkan.</p>
            </div>

            <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">
                <div className="flex flex-col gap-4">
                    {ingredients.map((item, index) => (
                        <div key={index} className="flex flex-col gap-3 p-4 border border-border-light dark:border-border-dark rounded-2xl bg-gray-50/50 dark:bg-white/5">
                            <div className="relative">
                                <label className="text-xs font-bold text-text-secondary dark:text-gray-400 mb-1 block ml-1">Nama Bahan</label>
                                <input className="w-full rounded-xl p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Tepung Terigu" value={item.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} />
                                {item.imagePreview && <img src={item.imagePreview} className="absolute right-3 bottom-2 h-8 w-8 rounded object-cover" alt="preview" />}
                            </div>
                            <div className="flex gap-3 items-end">
                                <div className="flex-grow">
                                    <label className="text-xs font-bold text-text-secondary dark:text-gray-400 mb-1 block ml-1">Jumlah</label>
                                    <input className="w-full rounded-xl p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: 500 gr" value={item.quantity} onChange={(e) => updateIngredient(index, 'quantity', e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative p-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" title="Tambah Foto">
                                        <span className="material-symbols-outlined text-text-secondary text-[22px]">photo_camera</span>
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleIngredientImageChange(index, e)} />
                                    </div>
                                    <button onClick={() => removeIngredient(index)} disabled={ingredients.length === 1} className="p-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30" title="Hapus Bahan">
                                        <span className="material-symbols-outlined text-[22px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addIngredient} className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary/5 flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span> Tambah Bahan
                </button>

                <div className="flex justify-between pt-6 border-t border-border-light dark:border-border-dark">
                    <button onClick={onBack} className="px-5 py-2 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm hover:bg-gray-50">Kembali</button>
                    <div className="flex gap-3">
                        <button onClick={onSaveDraft} disabled={isPublishing} className="px-5 py-2 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm hover:bg-gray-50 text-text-secondary">Simpan Draft</button>
                        <button onClick={onNext} className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2">
                            Lanjut ke Langkah <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepIngredients;
