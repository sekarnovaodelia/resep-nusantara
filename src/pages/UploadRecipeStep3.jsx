import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
// import { publishRecipe } from '../lib/uploadHelpers';
// import { useAuth } from '../context/AuthContext';

const UploadRecipeStep3 = () => {
    const navigate = useNavigate();
    // const { user } = useAuth();
    const [isPublishing, setIsPublishing] = useState(false);

    const {
        steps,
        addStep,
        removeStep,
        updateStep,
        resetForm,
        ...recipeData // Get all other data needing to be published (title, description, etc)
    } = useRecipe();

    const fullRecipeData = {
        steps,
        ...recipeData
    };

    const handleImageChange = (index, e) => {
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

    const handlePublish = async (isPublished = true) => {
        if (isPublishing) return;

        const hasValidStep = steps.some(step => step.description.trim() !== '');
        if (!hasValidStep) {
            alert('Mohon tambahkan setidaknya satu langkah memasak.');
            return;
        }

        const actionText = isPublished ? 'mempublish' : 'menyimpan draft';

        if (!confirm(`Apakah Anda yakin ingin ${actionText} resep ini?`)) {
            return;
        }

        setIsPublishing(true);

        // Simulate API Call
        setTimeout(() => {
            console.log('✅ Mock Publish Success:', fullRecipeData);
            alert(`Resep berhasil ${isPublished ? 'dipublish' : 'disimpan sebagai draft'} (Mock)!`);

            // Navigate to home or dummy recipe page
            navigate('/recipe/mock-id', { replace: true });

            // Reset form
            resetForm();
            setIsPublishing(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-10 md:pb-0">
            {/* Header */}
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
                {/* Progress */}
                <div className="w-full mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-text-main dark:text-white text-lg font-bold leading-normal">Langkah 3: Langkah Memasak</p>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal whitespace-nowrap">3 dari 3</p>
                        </div>
                        <div className="relative w-full h-2 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mt-1 px-1">
                            <span className="text-primary font-bold">Info Dasar</span>
                            <span className="text-primary font-bold">Bahan</span>
                            <span className="text-primary font-bold">Langkah</span>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="w-full mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1 text-left">
                            <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Cara Membuat</h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Urutkan langkah memasak agar mudah diikuti.</p>
                        </div>

                        <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">

                            {/* Metadata Section Removed */}

                            <div className="flex flex-col gap-4 md:gap-8">
                                {/* Step Cards */}
                                {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm group">
                                        {/* Number Badge */}
                                        <div className="flex md:flex-col items-center gap-3 w-full md:w-auto border-b md:border-b-0 border-border-light dark:border-border-dark pb-3 md:pb-0">
                                            <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="hidden md:block h-full min-h-[1.5rem] w-0.5 bg-border-light dark:bg-border-dark group-last:hidden"></div>
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="md:hidden ml-auto text-text-secondary hover:text-red-500 transition-colors"
                                                disabled={steps.length === 1}
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
                                            <div className="w-full md:w-[65%] flex flex-col gap-2">
                                                <label className="text-xs font-bold text-text-main dark:text-white uppercase tracking-wider">Instruksi</label>
                                                <textarea
                                                    className="form-textarea w-full rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary text-sm min-h-[120px] p-3 placeholder:text-text-secondary outline-none transition-all resize-none"
                                                    placeholder={index === 0 ? "Haluskan bumbu..." : "Tumis hingga harum..."}
                                                    value={step.description}
                                                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="w-full md:w-[35%] flex flex-col gap-2">
                                                <label className="text-xs font-bold text-text-main dark:text-white uppercase tracking-wider">Visual</label>
                                                <div className="relative aspect-video w-full rounded-xl border-2 border-dashed border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group/upload">
                                                    {step.imagePreview ? (
                                                        <>
                                                            <img src={step.imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-text-secondary group-hover/upload:text-primary text-3xl">add_a_photo</span>
                                                            <span className="text-[10px] text-text-secondary mt-1 font-medium">Tambah Foto</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(index, e)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeStep(index)}
                                            className="hidden md:block p-2 text-text-secondary hover:text-red-500 transition-colors"
                                            disabled={steps.length === 1}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addStep}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold bg-white/50 md:bg-transparent hover:bg-white dark:hover:bg-surface-dark hover:border-primary transition-all group text-sm"
                                >
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                                    Tambah Langkah
                                </button>
                            </div>

                            {/* Mobile Buttons */}
                            <div className="md:hidden flex flex-col gap-3 mt-4 relative z-30">
                                <button
                                    type="button"
                                    onClick={() => handlePublish(true)}
                                    disabled={isPublishing}
                                    className="relative z-30 w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPublishing ? 'Memproses...' : 'Publish Resep'}
                                    {!isPublishing && (
                                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handlePublish(false)}
                                    disabled={isPublishing}
                                    className="relative z-30 w-full py-4 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main dark:text-white font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    Simpan Draft
                                </button>
                            </div>


                            {/* Desktop Buttons */}
                            <div className="hidden md:flex items-center justify-end gap-3 mt-8 pt-8 border-t border-border-light dark:border-border-dark relative z-30">
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handlePublish(false)}
                                        disabled={isPublishing}
                                        className="relative z-30 px-6 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main dark:text-white font-bold hover:bg-background-light dark:hover:bg-background-dark transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        Simpan Draft
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePublish(true)}
                                        disabled={isPublishing}
                                        className="relative z-30 px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isPublishing ? 'Memproses...' : 'Publish Resep'}
                                        {!isPublishing && (
                                            <span className="material-symbols-outlined text-lg font-bold">
                                                rocket_launch
                                            </span>
                                        )}
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

export default UploadRecipeStep3;
