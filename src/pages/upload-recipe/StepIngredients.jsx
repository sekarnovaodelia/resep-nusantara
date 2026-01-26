import React from 'react';
import { useRecipe } from '../../context/RecipeContext';

const StepIngredients = ({ onNext, onBack }) => {
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
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-6 relative">
                                <input className="w-full rounded-xl p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Nama Bahan" value={item.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} />
                                {item.imagePreview && <img src={item.imagePreview} className="absolute right-2 top-2 h-8 w-8 rounded object-cover" alt="preview" />}
                            </div>
                            <div className="md:col-span-4">
                                <input className="w-full rounded-xl p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Jumlah" value={item.quantity} onChange={(e) => updateIngredient(index, 'quantity', e.target.value)} />
                            </div>
                            <div className="md:col-span-2 flex gap-2 justify-center">
                                <div className="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                    <span className="material-symbols-outlined text-text-secondary">photo_camera</span>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleIngredientImageChange(index, e)} />
                                </div>
                                <button onClick={() => removeIngredient(index)} disabled={ingredients.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">delete</span></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addIngredient} className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary/5 flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span> Tambah Bahan
                </button>

                {/* Nav Buttons */}
                <div className="flex justify-between pt-6 border-t border-border-light dark:border-border-dark">
                    <button onClick={onBack} className="px-6 py-3 rounded-xl border border-border-light dark:border-border-dark font-bold hover:bg-gray-50">Kembali</button>
                    <button onClick={onNext} className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2">
                        Lanjut ke Langkah <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepIngredients;
