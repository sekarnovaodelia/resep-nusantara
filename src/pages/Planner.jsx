import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Planner = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
    const [isRecipePickerOpen, setIsRecipePickerOpen] = useState(false);
    const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
    const [activePickerSlot, setActivePickerSlot] = useState(null); // { dayIndex: 0, mealType: 'breakfast' }
    const [currentDayIndex, setCurrentDayIndex] = useState(0); // 0 = Monday

    // Mock Data for Saved Recipes
    const allSavedRecipes = [
        { id: 1, name: 'Nasi Goreng Kampung', time: '20m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB80UvNrkJi1WhsjYIVDkkb-UUUEzu85gAhv6KCRbEQnKoGqjNxia42Kl-DLsb5DGDmGrSlG5AFzqRovf65QHHhDI1npo7jAGaHgrMXt289GBtTYmQiq1Jv5Lk1FBFykjMmhMZANPnLq0TiedInzbs2PBuV0mLzO7V9OzZ6KS0nu5q43Cw1ktyRVKE1sycgTgxYHvr56-mnKb-2NHhjGX7zhZaNqdpq9RGZX2jhmYAnz4lePysmhR9UcmWCDgB1B7g2PI9LIUXjr69F', tags: ['Cepat', 'Indonesia'] },
        { id: 2, name: 'Gado-Gado Special', time: '35m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBELUZVLEmUlcCczy-oLIk9nj71WLjiBxMCmx7aijMtbUERcLCt4hmWTSEMvkSFgVruIgTEZ05r-vDI5Z_m0-VLcoTm5_UbzboZgi6loEBdWCm5qP3UTK63sbFIRl4UdhA69gjK3cCWO1a8wzmabz0_Yb6Bo9BlB7nrfkd38dkXGvQDXf3fUwBviKt7lHk1ExShuGCcl7xEuNfTMQBmuagnv7EdVX8FQs30bFu8nJDTAg-6oTbTWObVhPmwrcva9sZgQTNYVMw9XNsB', tags: ['Vegetarian', 'Sehat'] },
        { id: 3, name: 'Sate Ayam Madura', time: '45m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzZMhJxcP3hkRZYGLr6HyZHhgO8EMgzhoNSLRLCJKdabSS2Ovc1e6jbOLu_RXlUvYGXmsSRkZ6zF3OEKPlKiOWXTdym3STVQaS9B2JaMkvSV8LPWcsWYZ70X6OlrUKWzrMgfVsfs1lkPSKEFWDfaY0-pMpyieEj0AV1LHzABROe-dojd5wxtF96jcNj5d8wKkbT-NmwtRrm-clEs9CWHfcFTTQl9vwedugykCLjjXTyYIMA9AABOXtG5pNsjd69EcB-OaIWS7atBnZ', tags: ['Protein', 'Bakar'] },
        { id: 4, name: 'Soto Ayam Lamongan', time: '60m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRO7XId2UPi-fQmjlOBIPbYAOkU576xzTQ83g5bLRq0CxaE_RipSnLvIJXeF55icN9APJ1kz00rOpvbn6AE-Pb0EN-ytoQ-FmyGoqyBRcP4Wcku1frxN_2TCtVyIX0EH-sJ_kSlHK850-UtzlblJkLB-klBp7ZQbqohiOU2Pv-pK7FxkDLiEDXH2HKhw42ttuVH0BH3brMmYS0f3qXl02Vhpd1jAz2j68MD-kT4eeMqfNslaamkLM1_lwaxf7wrdoIypfUW8nhIl33', tags: ['Soto', 'Nyaman'] },
        { id: 5, name: 'Rendang Sapi', time: '3j', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbxupJkCta3tZFsyCzjPGWMT4yuqGiMMhnzJF8_gQOAsC3kIIC9jyWn22ziX42cMPCc78T1LN2tc4g8gf_fZ1RsBmAZb9JqQ6j35RyO-bEqOtS-VHFVtOCN2w5vYBciRX_qKymnq8Pk-gDtReY1zcomA2hgIQChSepwbBSXQYpbVGo3k38x0o3WAUqC4nYzsYoUDp3O0oLgwj8OV4DxkDCn2VzV_GsBMkNzTM-yRIn4APFIbKvkkmbvU7F369xaWPJDWep4SN_feYk', tags: ['Masak Lambat', 'Pedas'] },
        { id: 6, name: 'Bubur Ayam Jakarta', time: '45m', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCso2LaEMafR9j8XQCbbNyEODVemTKLxY3CvGnHBfEJa08mwp7_vv0j7O-pHBpWJYd8iWWL9BmHcIJ3uHxhCq0Gd-AFfkinzcoyqQvvSMZirabQcOKki1FD4OX9bpUpLF6HASODsuupZGA86dkpjFTyL2kk-_AWwT2Bxd4VpvhmUNluMrFven5NWyY8KtGBMfDRNjZ-ISCwcuq5TCNDFZfJ8m725wMUitG1UkT05Eaq3R58OQNUzIo63p0byJHmnm04VOse5NpD351m', tags: ['Sarapan', 'Nyaman'] },
    ];

    // Initial Planner State - Weekly Data Source of Truth
    const [weekData, setWeekData] = useState({
        0: { // Senin
            breakfast: [allSavedRecipes[5]],
            lunch: [allSavedRecipes[1]],
            dinner: [allSavedRecipes[2]],
        },
        1: { breakfast: [], lunch: [], dinner: [] }, // Selasa
        2: { breakfast: [], lunch: [], dinner: [] }, // Rabu
        3: { breakfast: [], lunch: [], dinner: [] }, // Kamis
        4: { breakfast: [], lunch: [], dinner: [] }, // Jumat
        5: { breakfast: [], lunch: [], dinner: [] }, // Sabtu
        6: { breakfast: [], lunch: [], dinner: [] }, // Minggu
    });

    const categories = ['Bahan Segar', 'Protein & Bahan Kering', 'Bumbu & Saus'];
    const [shoppingList, setShoppingList] = useState({
        'Bahan Segar': [
            { name: 'Bawang Merah & Putih', detail: 'Masing-masing 250g', checked: false },
            { name: 'Timun & Tomat', detail: 'Untuk hiasan & salad', checked: false },
            { name: 'Cabai Rawit', detail: 'Pak 100g', checked: false },
        ],
        'Protein & Bahan Kering': [
            { name: 'Dada Ayam', detail: '1.5kg, iris/sate', checked: false },
            { name: 'Beras Jasmine', detail: 'Kantong 5kg', checked: false },
            { name: 'Santan', detail: '3 pak (200ml)', checked: true },
            { name: 'Tempe & Tahu', detail: 'Masing-masing 2 blok', checked: false },
        ],
        'Bumbu & Saus': [
            { name: 'Kecap Manis', detail: 'Bango 275ml', checked: false },
            { name: 'Pasta Bumbu Kacang', detail: 'Merek Jawa asli', checked: false },
        ]
    });

    // Helper to get filtered saved recipes
    const filteredRecipes = allSavedRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add Meal Helper
    const addMealToState = (dayIndex, mealType, recipe) => {
        setWeekData(prev => ({
            ...prev,
            [dayIndex]: {
                ...prev[dayIndex],
                [mealType]: [...(prev[dayIndex]?.[mealType] || []), recipe]
            }
        }));
    };

    const removeMeal = (dayIndex, mealType, mealIndex) => {
        setWeekData(prev => ({
            ...prev,
            [dayIndex]: {
                ...prev[dayIndex],
                [mealType]: prev[dayIndex][mealType].filter((_, i) => i !== mealIndex)
            }
        }));
    };

    // Handler for Recipe Picker Addition
    const handlePickerAdd = (recipe) => {
        if (activePickerSlot) {
            const day = activePickerSlot.dayIndex !== undefined ? activePickerSlot.dayIndex : currentDayIndex;
            addMealToState(day, activePickerSlot.mealType, recipe);
            setIsRecipePickerOpen(false);
            setActivePickerSlot(null);
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e, recipe) => {
        e.dataTransfer.setData('recipeId', recipe.id);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e, mealType) => {
        e.preventDefault();
        const recipeId = parseInt(e.dataTransfer.getData('recipeId'));
        const recipe = allSavedRecipes.find(r => r.id === recipeId);
        if (recipe) {
            addMealToState(currentDayIndex, mealType, recipe);
        }
    };

    const toggleShoppingItem = (category, index) => {
        setShoppingList(prev => {
            const newList = { ...prev };
            newList[category][index].checked = !newList[category][index].checked;
            return newList;
        });
    };

    const openRecipePicker = (slot) => {
        setActivePickerSlot(slot);
        setIsRecipePickerOpen(true);
    };

    const currentMeals = weekData[currentDayIndex] || { breakfast: [], lunch: [], dinner: [] };
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark lg:flex-row">
            {/* Sidebar: Saved Recipes (Desktop Stick) */}
            <aside className="w-72 flex-shrink-0 flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark hidden lg:flex sticky top-0 self-start">
                <SavedRecipesContent
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    recipes={filteredRecipes}
                    handleDragStart={handleDragStart}
                    navigate={navigate}
                />
            </aside>

            {/* Main Content: Planner */}
            <main className="flex-1 flex flex-col relative w-full pb-20 lg:pb-0">
                <div className="sticky top-0 z-30 p-4 md:p-6 bg-white dark:bg-surface-dark border-b border-gray-300 dark:border-gray-700 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-text-main dark:text-white tracking-tight">Perencana Makan</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentDayIndex(prev => (prev > 0 ? prev - 1 : 6))}
                                className="size-8 flex items-center justify-center rounded-full hover:bg-background-light dark:hover:bg-[#3e3228] text-text-secondary dark:text-[#9a6c4c] transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-2 text-text-secondary dark:text-[#9a6c4c] font-bold min-w-[160px] justify-center">
                                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                <span>{days[currentDayIndex]}, 23 Okt</span>
                            </div>
                            <button
                                onClick={() => setCurrentDayIndex(prev => (prev < 6 ? prev + 1 : 0))}
                                className="size-8 flex items-center justify-center rounded-full hover:bg-background-light dark:hover:bg-[#3e3228] text-text-secondary dark:text-[#9a6c4c] transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
                        <div className="flex items-center p-1 bg-[#fcfaf8] dark:bg-[#342a22] rounded-xl border border-gray-300 dark:border-gray-700">
                            <button
                                onClick={() => setViewMode('daily')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'daily' ? 'bg-white dark:bg-[#3e3228] text-primary shadow-sm' : 'text-text-secondary hover:text-text-main dark:text-[#9a6c4c] dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">view_day</span>
                                <span className="hidden sm:inline">Harian</span>
                            </button>
                            <button
                                onClick={() => setViewMode('weekly')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'weekly' ? 'bg-white dark:bg-[#3e3228] text-primary shadow-sm' : 'text-text-secondary hover:text-text-main dark:text-[#9a6c4c] dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">calendar_view_week</span>
                                <span className="hidden sm:inline">Mingguan</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
                    {viewMode === 'daily' ? (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <SlotSection
                                title="Sarapan"
                                icon="bakery_dining"
                                meals={currentMeals.breakfast || []}
                                onRemove={(idx) => removeMeal(currentDayIndex, 'breakfast', idx)}
                                onAdd={() => openRecipePicker({ mealType: 'breakfast' })}
                                handleDrop={(e) => handleDrop(e, 'breakfast')}
                                handleDragOver={handleDragOver}
                            />
                            <SlotSection
                                title="Makan Siang"
                                icon="lunch_dining"
                                meals={currentMeals.lunch || []}
                                onRemove={(idx) => removeMeal(currentDayIndex, 'lunch', idx)}
                                onAdd={() => openRecipePicker({ mealType: 'lunch' })}
                                handleDrop={(e) => handleDrop(e, 'lunch')}
                                handleDragOver={handleDragOver}
                            />
                            <SlotSection
                                title="Makan Malam"
                                icon="dinner_dining"
                                meals={currentMeals.dinner || []}
                                onRemove={(idx) => removeMeal(currentDayIndex, 'dinner', idx)}
                                onAdd={() => openRecipePicker({ mealType: 'dinner' })}
                                handleDrop={(e) => handleDrop(e, 'dinner')}
                                handleDragOver={handleDragOver}
                            />
                        </div>
                    ) : (
                        // Weekly View
                        <div className="max-w-[1600px] mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                    const dayMeals = weekData[dayIndex] || { breakfast: [], lunch: [], dinner: [] };
                                    return (
                                        <div key={dayIndex} className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-3 bg-[#fcfaf8] dark:bg-[#342a22] border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
                                                <span className="font-bold text-text-main dark:text-white uppercase tracking-wider text-sm">
                                                    {days[dayIndex]}
                                                </span>
                                                <span className="text-xs text-text-secondary dark:text-[#9a6c4c] font-medium">{23 + dayIndex} Okt</span>
                                            </div>
                                            <div className="p-3 flex-1 flex flex-col gap-3 min-h-[240px]">
                                                {['Sarapan', 'Makan Siang', 'Makan Malam'].map((type) => {
                                                    const mType = type === 'Sarapan' ? 'breakfast' : type === 'Makan Siang' ? 'lunch' : 'dinner';
                                                    const meals = dayMeals[mType] || [];
                                                    return (
                                                        <div key={type} className="group relative bg-background-light dark:bg-background-dark/50 rounded-lg p-2 border border-transparent hover:border-primary/20 transition-all">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-[10px] font-bold text-text-secondary dark:text-[#9a6c4c] uppercase tracking-wide">{type}</p>
                                                                <button
                                                                    onClick={() => openRecipePicker({ dayIndex, mealType: mType })}
                                                                    className="size-5 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                                                                </button>
                                                            </div>
                                                            <div className="space-y-1.5 min-h-[32px]">
                                                                {meals.map((meal, mIdx) => (
                                                                    <div key={`${dayIndex}-${mType}-${mIdx}`} className="group/meal flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-white dark:hover:bg-black/20 shadow-none hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all">
                                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                            <div className="size-6 rounded bg-cover bg-center shrink-0 shadow-xs" style={{ backgroundImage: `url("${meal.image}")` }}></div>
                                                                            <p className="text-xs font-semibold text-text-main dark:text-white truncate">{meal.name}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); removeMeal(dayIndex, mType, mIdx); }}
                                                                            className="text-text-secondary hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover/meal:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {/* MOBILE STACKED LAYOUT: Saved Recipes + Shopping List */}
                    <div className="lg:hidden flex flex-col gap-8 pt-8 border-t border-gray-300 dark:border-gray-700">
                        {/* Mobile Saved Recipes */}
                        <section className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-300 dark:border-gray-700 overflow-hidden">
                            <SavedRecipesContent
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                recipes={filteredRecipes}
                                handleDragStart={handleDragStart}
                                navigate={navigate}
                            />
                        </section>
                        {/* Mobile Shopping List */}
                        <section className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-300 dark:border-gray-700 overflow-hidden">
                            <ShoppingListContent shoppingList={shoppingList} toggleShoppingItem={toggleShoppingItem} categories={categories} />
                        </section>
                    </div>
                </div>
            </main>
            {/* Shopping List Sidebar (Desktop Sticky) */}
            <aside className="w-80 flex-shrink-0 flex-col border-l border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark hidden lg:flex sticky top-0 self-start">
                <ShoppingListContent shoppingList={shoppingList} toggleShoppingItem={toggleShoppingItem} categories={categories} navigate={navigate} />
            </aside>
            {/* Mobile Recipe Picker Modal */}
            {isRecipePickerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Pilih Resep</h3>
                            <button onClick={() => setIsRecipePickerOpen(false)} className="p-2 hover:bg-background-light dark:hover:bg-[#342a22] rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-[#fcfaf8] dark:bg-[#342a22]">
                            <input
                                type="text"
                                placeholder="Cari koleksimu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 text-sm rounded-xl bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-primary focus:border-primary text-text-main dark:text-white"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filteredRecipes.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handlePickerAdd(recipe)}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-primary hover:bg-orange-50 dark:hover:bg-primary/10 transition-all text-left group"
                                >
                                    <div className="size-16 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url("${recipe.image}")` }}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-text-main dark:text-white text-sm truncate">{recipe.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary dark:text-[#9a6c4c]">
                                            <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">schedule</span> {recipe.time}</span>
                                        </div>
                                    </div>
                                    <div className="size-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">add</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
// Sub-component for Saved Recipes Content (Shared)
const SavedRecipesContent = ({ searchQuery, setSearchQuery, recipes, handleDragStart, navigate }) => (
    <>
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
            <h2 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">Resep Tersimpan</h2>
            <input
                type="text"
                placeholder="cari resep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-3 px-3 py-2 text-sm rounded-lg bg-[#fcfaf8] dark:bg-[#342a22] border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-primary focus:border-primary text-text-main dark:text-white"
            />
            <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#f3ece7] dark:bg-[#3e3228] text-xs font-bold rounded-lg text-primary">Semua</button>
                <button className="px-3 py-1.5 text-xs font-medium text-text-secondary dark:text-[#9a6c4c] hover:bg-[#f3ece7] dark:hover:bg-[#3e3228] rounded-lg transition-colors">Indonesia</button>
                <button className="px-3 py-1.5 text-xs font-medium text-text-secondary dark:text-[#9a6c4c] hover:bg-[#f3ece7] dark:hover:bg-[#3e3228] rounded-lg transition-colors">Cepat</button>
            </div>
        </div>
        <div className="flex-1 pt-4 md:p-3 space-y-2">
            <div className="space-y-2">
                {recipes.map(recipe => (
                    <div
                        key={recipe.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, recipe)}
                        className="group p-3 rounded-2xl bg-white dark:bg-[#342a22] border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-lg">drag_indicator</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="size-16 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm" style={{ backgroundImage: `url("${recipe.image}")` }}></div>
                            <div className="flex-1 min-w-0 py-1">
                                <h4 className="font-bold text-text-main dark:text-white text-sm truncate">{recipe.name}</h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-900/20 text-[10px] font-bold text-primary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span> {recipe.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
);
// Sub-component for Daily Slot Section
const SlotSection = ({ title, icon, meals, onRemove, onAdd, handleDrop, handleDragOver }) => (
    <section
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-white/50 dark:bg-surface-dark/50 rounded-3xl p-4 md:p-6 border border-transparent hover:border-primary/30 transition-colors"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-text-main dark:text-white">{title}</h3>
                </div>
            </div>
        </div>
        <div className="space-y-4">
            {meals.map((meal, index) => (
                <div key={index} className="group bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-2xl p-4 flex gap-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl bg-cover bg-center shadow-sm" style={{ backgroundImage: `url("${meal.image}")` }}></div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex items-start justify-between">
                                <h4 className="text-lg md:text-xl font-bold text-text-main dark:text-white leading-tight pr-8">{meal.name}</h4>
                                {/* Delete Button: Always visible on mobile, hover on desktop */}
                                <button onClick={() => onRemove(index)} className="absolute top-4 right-4 lg:relative lg:top-auto lg:right-auto text-text-secondary dark:text-[#9a6c4c] hover:text-red-500 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-white/80 dark:bg-surface-dark/80 lg:bg-transparent rounded-full p-1 lg:p-0">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {meal.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-[#fcfaf8] dark:bg-[#342a22] text-text-secondary dark:text-[#9a6c4c] text-[10px] uppercase font-bold tracking-wider rounded">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-1.5 text-text-secondary dark:text-[#9a6c4c] text-xs font-bold">
                                <span className="material-symbols-outlined text-lg">schedule</span> {meal.time}
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-text-secondary dark:text-[#9a6c4c] text-xs font-bold">
                                <span className="material-symbols-outlined text-lg">person</span> 2 Porsi
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-text-secondary dark:text-[#9a6c4c] hover:text-primary hover:border-primary/30 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-all font-bold flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">add_circle</span>
                Tambah Menu {title}
            </button>
        </div>
    </section>
);
// Sub-component for Shopping List Content
const ShoppingListContent = ({ shoppingList, categories, toggleShoppingItem, navigate }) => (
    <>
        <div className="p-6 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-extrabold text-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_basket</span>
                    Daftar Belanja
                </h3>
            </div>
            <p className="text-xs text-text-secondary dark:text-[#9a6c4c] font-medium uppercase tracking-wide">Estimasi untuk 18 porsi</p>
        </div>
        <div className="flex-1 p-6 space-y-6">
            {categories.map(category => (
                <div key={category}>
                    <h4 className="text-[10px] font-black uppercase text-text-secondary dark:text-[#9a6c4c] tracking-[0.1em] mb-3">{category}</h4>
                    <div className="space-y-3">
                        {shoppingList[category].map((item, idx) => (
                            <div key={item.name} className="flex items-start gap-3 group bg-white dark:bg-[#342a22] p-3 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-white">{item.name}</p>
                                    <p className="text-xs text-text-secondary dark:text-[#9a6c4c] font-medium mt-0.5">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="p-6 bg-white dark:bg-surface-dark border-t border-gray-300 dark:border-gray-700">
            <button
                onClick={() => navigate('/shopping-list')}
                className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group"
            >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">shopping_cart</span>
                Buat Daftar Lengkap
            </button>
        </div>
    </>
);
export default Planner;
