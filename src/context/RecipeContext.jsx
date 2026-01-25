import { createContext, useContext, useState } from 'react';

const RecipeContext = createContext({});

export const useRecipe = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
    // Step 1: Basic Info
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [regionId, setRegionId] = useState(null);
    const [regionName, setRegionName] = useState('');

    // Step 2: Ingredients
    const [ingredients, setIngredients] = useState([
        { name: '', quantity: '', imageFile: null, imagePreview: null }
    ]);

    // Step 3: Steps
    const [steps, setSteps] = useState([
        { description: '', imageFile: null, imagePreview: null }
    ]);

    // Metadata
    const [tags, setTags] = useState([]);

    // Helper functions
    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', imageFile: null, imagePreview: null }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addStep = () => {
        setSteps([...steps, { description: '', imageFile: null, imagePreview: null }]);
    };

    const removeStep = (index) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    };

    const updateStep = (index, field, value) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setMainImageFile(null);
        setMainImagePreview(null);
        setRegionId(null);
        setRegionName('');
        setIngredients([{ name: '', quantity: '', imageFile: null, imagePreview: null }]);
        setSteps([{ description: '', imageFile: null, imagePreview: null }]);
        setTags([]);
    };

    const value = {
        // Step 1
        title, setTitle,
        description, setDescription,
        mainImageFile, setMainImageFile,
        mainImagePreview, setMainImagePreview,
        regionId, setRegionId,
        regionName, setRegionName,

        // Step 2
        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient,

        // Step 3
        steps,
        addStep,
        removeStep,
        updateStep,

        // Metadata
        tags, setTags,

        // Helpers
        resetForm,
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
};
