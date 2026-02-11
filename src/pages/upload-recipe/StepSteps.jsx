import React from 'react';
import { useRecipe } from '../../context/RecipeContext';

const StepSteps = ({ onBack, onPublish, isPublishing }) => {
    const {
        steps,
        addStep,
        removeStep,
        updateStep
    } = useRecipe();

    const handleStepImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateStep(index, 'imagePreview', reader.result);
                updateStep(index, 'imageFile', file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-left">
                <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Cara Membuat</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Urutkan langkah memasak agar mudah diikuti.</p>
            </div>

            <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">
                <div className="flex flex-col gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-border-light dark:border-border-dark rounded-2xl">
                            <div className="flex items-center justify-center size-8 bg-primary text-white rounded-full font-bold shrink-0">{index + 1}</div>
                            <div className="flex-1 flex flex-col gap-2">
                                <textarea className="w-full p-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]" placeholder="Deskripsi langkah..." value={step.description} onChange={(e) => updateStep(index, 'description', e.target.value)}></textarea>
                            </div>
                            <div className="w-full md:w-[35%]">
                                <div className="relative aspect-video rounded-xl border-2 border-dashed border-border-light flex items-center justify-center cursor-pointer hover:border-primary/50 bg-background-light dark:bg-background-dark group overflow-hidden">
                                    {step.imagePreview ? (
                                        <img src={step.imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                    ) : (
                                        <div className="flex flex-col items-center text-text-secondary"><span className="material-symbols-outlined">add_photo_alternate</span><span className="text-xs">Foto</span></div>
                                    )}
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleStepImageChange(index, e)} />
                                </div>
                            </div>
                            <button onClick={() => removeStep(index)} disabled={steps.length === 1} className="text-red-500 hover:text-red-700 md:self-start"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                    ))}
                    <button onClick={addStep} className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary/5 flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined">add_circle</span> Tambah Langkah
                    </button>
                </div>

                {/* Nav Buttons */}
                {/* Nav Buttons */}
                <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 pt-6 border-t border-border-light dark:border-border-dark">
                    <button onClick={onBack} className="w-full md:w-auto px-5 py-2 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm hover:bg-gray-50">Kembali</button>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <button onClick={() => onPublish(false)} disabled={isPublishing} className="w-full md:w-auto px-5 py-2 rounded-xl border border-border-light dark:border-border-dark font-bold text-sm hover:bg-gray-50 text-text-secondary">Simpan Draft</button>
                        <button onClick={() => onPublish(true)} disabled={isPublishing} className="w-full md:w-auto px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-primary/30 flex gap-2 items-center justify-center">
                            {isPublishing ? 'Memproses...' : 'Publish'} {!isPublishing && <span className="material-symbols-outlined text-lg">rocket_launch</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepSteps;
