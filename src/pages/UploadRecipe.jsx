import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

    // Handle Edit Mode
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    // Context Data
    const {
        title, setTitle,
        description, setDescription,
        mainImageFile, setMainImageFile,
        mainImagePreview, setMainImagePreview,
        regionId, setRegionId,
        ingredients, setIngredients,
        steps, setSteps,
        tags, setTags,
        resetForm,
    } = useRecipe();

    // Explicitly construct full data object
    const fullRecipeData = {
        title,
        description,
        mainImageFile,
        mainImageUrl: mainImagePreview, // Pass existing URL if file is null (for updates)
        regionId,
        ingredients,
        steps,
        tags: tags || []
    };

    // Smooth scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Load Data for Edit
    useEffect(() => {
        const loadForEdit = async () => {
            if (editId && user) {
                try {
                    const { getRecipeForEdit } = await import('../lib/recipeService');
                    const recipe = await getRecipeForEdit(editId);

                    if (recipe.user_id !== user.id) {
                        alert('Anda tidak berhak mengedit resep ini.');
                        navigate('/');
                        return;
                    }

                    // Populate Context
                    setTitle(recipe.title);
                    setDescription(recipe.description || '');
                    setMainImagePreview(recipe.main_image_url);
                    setMainImageFile(null); // Reset file input
                    setRegionId(recipe.region_id);

                    // Map ingredients
                    const mappedIngredients = recipe.ingredients.map(ing => ({
                        name: ing.name,
                        quantity: ing.quantity || '',
                        imageFile: null,
                        imagePreview: ing.image_url
                    }));
                    setIngredients(mappedIngredients.length > 0 ? mappedIngredients : [{ name: '', quantity: '', imageFile: null, imagePreview: null }]);

                    // Map steps
                    const mappedSteps = recipe.steps.map(step => ({
                        description: step.description,
                        imageFile: null,
                        imagePreview: step.image_url
                    }));
                    setSteps(mappedSteps.length > 0 ? mappedSteps : [{ description: '', imageFile: null, imagePreview: null }]);

                    setTags(recipe.tags || []);

                } catch (error) {
                    console.error('Error loading recipe for edit:', error);
                    alert('Gagal memuat resep untuk diedit.');
                }
            }
        };
        loadForEdit();
    }, [editId, user]); // eslint-disable-line react-hooks/exhaustive-deps

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

        if (editId) {
            // UPDATE Logic
            if (!confirm(`Apakah Anda yakin ingin menyimpan perubahan pada resep ini?`)) return;
            setIsPublishing(true);
            try {
                const { updateRecipe } = await import('../lib/recipeService');
                await updateRecipe(editId, fullRecipeData, user.id);
                alert('Resep berhasil diperbarui!');
                resetForm();
                navigate(`/recipe/${editId}`, { replace: true });
            } catch (error) {
                console.error('🔴 Update error:', error);
                alert(`Gagal memperbarui resep: ${error.message}`);
            } finally {
                setIsPublishing(false);
            }
            return;
        }

        // CREATE Logic
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
                    <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">{editId ? 'Edit Resep' : 'Upload Resep'}</h2>
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
                    {currentStep === 3 && <StepSteps onBack={() => setCurrentStep(2)} onPublish={handlePublish} isPublishing={isPublishing} isEditing={!!editId} />}
                </div>
            </main>
        </div>
    );
};

export default UploadRecipe;
