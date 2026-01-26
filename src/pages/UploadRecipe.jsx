import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import { publishRecipe } from '../lib/recipeService';
import StepInfo from './upload-recipe/StepInfo';
import StepIngredients from './upload-recipe/StepIngredients';
import StepSteps from './upload-recipe/StepSteps';

const UploadRecipe = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isPublishing, setIsPublishing] = useState(false);

    // Context Data
    const {
        title,
        description,
        mainImageFile,
        regionId,
        ingredients,
        steps,
        tags,
        resetForm,
    } = useRecipe();

    // Explicitly construct full data object
    const fullRecipeData = {
        title,
        description,
        mainImageFile,
        regionId,
        ingredients,
        steps,
        tags: tags || []
    };

    // Smooth scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Handlers
    const nextToStep2 = () => {
        if (!title.trim()) {
            alert('Nama resep harus diisi!');
            return;
        }
        setCurrentStep(2);
    };

    const nextToStep3 = () => {
        const hasValidIngredient = ingredients.some(ing => ing.name.trim() !== '');
        if (!hasValidIngredient) {
            alert('Mohon tambahkan setidaknya satu bahan.');
            return;
        }
        setCurrentStep(3);
    };

    const handlePublish = async (isPublished = true) => {
        if (isPublishing) return;

        if (!user) {
            alert('Anda harus login untuk menyimpan resep.');
            navigate('/login');
            return;
        }

        const hasValidStep = steps.some(step => step.description.trim() !== '');
        if (!hasValidStep) {
            alert('Mohon tambahkan setidaknya satu langkah memasak.');
            return;
        }

        const actionText = isPublished ? 'mempublish' : 'menyimpan draft';
        if (!confirm(`Apakah Anda yakin ingin ${actionText} resep ini?`)) return;

        setIsPublishing(true);

        try {
            const recipe = await publishRecipe(fullRecipeData, user.id, isPublished);
            alert(`Resep berhasil ${isPublished ? 'dipublish' : 'disimpan sebagai draft'}!`);
            resetForm();
            navigate(`/recipe/${recipe.id}`, { replace: true });
        } catch (error) {
            console.error('🔴 Publish error:', error);
            alert(`Gagal ${actionText} resep: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-10 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-20 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark py-3">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
                    <button
                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}
                        className="flex items-center justify-center text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-all size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">Upload Resep</h2>
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center py-6 px-4 w-full max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="w-full mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-text-main dark:text-white text-lg font-bold leading-normal">
                                {currentStep === 1 ? 'Langkah 1: Info Dasar' :
                                    currentStep === 2 ? 'Langkah 2: Bahan-bahan' :
                                        'Langkah 3: Langkah Memasak'}
                            </p>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal">{currentStep} dari 3</p>
                        </div>
                        <div className="relative w-full h-2 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${(currentStep / 3) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mt-1 px-1">
                            <span className={currentStep >= 1 ? "text-primary font-bold" : ""}>Info Dasar</span>
                            <span className={currentStep >= 2 ? "text-primary font-bold" : ""}>Bahan</span>
                            <span className={currentStep >= 3 ? "text-primary font-bold" : ""}>Langkah</span>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="w-full mx-auto">
                    {currentStep === 1 && <StepInfo onNext={nextToStep2} />}
                    {currentStep === 2 && <StepIngredients onNext={nextToStep3} onBack={() => setCurrentStep(1)} />}
                    {currentStep === 3 && <StepSteps onBack={() => setCurrentStep(2)} onPublish={handlePublish} isPublishing={isPublishing} />}
                </div>
            </main>
        </div>
    );
};

export default UploadRecipe;
