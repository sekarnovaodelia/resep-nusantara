import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragOverlay,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

// --- Modal Component ---

const RecipeSelectionModal = ({ isOpen, onClose, onSelect, savedRecipes }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-background-light dark:bg-background-dark">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1b130d] dark:text-white">Pilih Resep</h3>
                        <p className="text-sm text-[#9a6c4c] dark:text-gray-300">Pilih dari koleksi tersimpan Anda</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[#9a6c4c] dark:text-white">close</span>
                    </button>
                </div>

                <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <div className="relative w-full">
                        <span className="absolute text-xl -translate-y-1/2 material-symbols-outlined left-3 top-1/2 text-[#9a6c4c] dark:text-gray-400">search</span>
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#fcfaf8] dark:bg-[#342a22] border border-border-light dark:border-border-dark focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                            placeholder="Cari resep..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f7f6] dark:bg-[#1b130d]">
                    {savedRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => onSelect(recipe)}
                            className="flex items-center gap-4 p-3 bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark hover:border-primary cursor-pointer transition-all shadow-sm group"
                        >
                            <div
                                className="size-16 rounded-lg bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/100x100'}")` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#1b130d] dark:text-white text-base group-hover:text-primary transition-colors">{recipe.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[#9a6c4c] dark:text-gray-300 font-medium">
                                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">person</span> {recipe.portion || '-'} Porsi</span>
                                </div>
                            </div>
                            <button className="size-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-primary bg-orange-50 dark:bg-orange-900/20 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>
                    ))}
                    {savedRecipes.length === 0 && (
                        <p className="text-center text-gray-400 py-4">Belum ada resep tersimpan.</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};


// --- Drag and Drop Components ---

const DraggableRecipeCard = ({ recipe }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: recipe.id,
        data: { type: 'Recipe', recipe },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`group p-2 rounded-xl bg-[#fcfaf8] dark:bg-[#342a22] border border-border-light dark:border-border-dark hover:border-primary cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <div className="flex gap-3 items-center">
                <div
                    className="size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url("${recipe.main_image_url || 'https://placehold.co/100x100'}")` }}
                ></div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1b130d] dark:text-white text-sm leading-tight">
                        {recipe.title}
                    </h4>
                </div>
            </div>
        </div>
    );
};

// Generic Droppable Slot
const DroppableMealSlot = ({ title, icon, slotId, currentRecipe, onRemove, onAddClick, compact = false }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: slotId,
    });

    const navigate = useNavigate();

    return (
        <section className={`flex flex-col h-full ${compact ? 'min-h-[150px]' : ''}`}>

            {!compact && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{icon}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-[#1b130d] dark:text-white">
                                {title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={setNodeRef}
                className={`flex-1 rounded-2xl transition-colors ${isOver ? 'bg-orange-50 dark:bg-orange-900/10 ring-2 ring-primary ring-dashed' : ''
                    } ${compact ? 'border border-dashed border-primary/20 bg-white/50 dark:bg-surface-dark/50 p-2' : 'space-y-4'}`}
            >
                {currentRecipe ? (
                    <div
                        onClick={() => navigate(`/recipe/${currentRecipe.id}`)}
                        className={`group bg-white dark:bg-surface-dark border border-primary/20 dark:border-border-dark rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col relative cursor-pointer ${compact ? 'h-full' : 'h-48'}`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url("${currentRecipe.image}")` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-black/50 rounded-full text-[#9a6c4c] dark:text-white hover:text-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 z-10">
                            <h4 className={`font-bold text-white leading-tight drop-shadow-lg ${compact ? 'text-sm' : 'text-xl'}`}>
                                {currentRecipe.name}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={onAddClick}
                        className={`w-full h-full border-2 border-dashed border-primary/20 dark:border-border-dark rounded-2xl text-[#9a6c4c] dark:text-gray-200 hover:text-primary hover:border-primary/30 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-all font-bold flex flex-col items-center justify-center gap-2 ${compact ? 'py-6 text-xs' : 'py-4'}`}
                    >
                        <span className={`material-symbols-outlined ${compact ? 'text-xl' : 'text-3xl'}`}>add_circle</span>
                        <span className="text-center">{compact ? 'Tambah' : 'Tambah Menu'}</span>
                    </button>
                )}
            </div>
        </section>
    );
};

// --- Weekly Calendar Component ---

const WeeklyCalendar = ({ currentDate, mealPlan, setMealPlan, getSlotId, onAddClick, onRemove }) => {
    // Generate dates for the week (starting Monday)
    const weekDates = useMemo(() => {
        const dates = [];
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, [currentDate]);

    const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {weekDates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                    <div key={dateStr} className={`flex flex-col bg-white dark:bg-surface-dark rounded-2xl border ${isToday ? 'border-primary shadow-md ring-1 ring-primary' : 'border-border-light dark:border-border-dark'} overflow-hidden`}>
                        {/* Day Header */}
                        <div className={`p-4 border-b ${isToday ? 'bg-orange-50 dark:bg-orange-900/20 border-primary/30' : 'bg-[#fcfaf8] dark:bg-[#342a22] border-border-light dark:border-border-dark'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-[#9a6c4c] dark:text-gray-300'}`}>
                                    {weekDays[index]}
                                </span>
                                <span className={`text-lg font-extrabold ${isToday ? 'text-primary' : 'text-[#1b130d] dark:text-white'}`}>
                                    {date.getDate()}
                                </span>
                            </div>
                        </div>

                        {/* Meal Slots (Mini) */}
                        <div className="p-3 space-y-3 flex-1 flex flex-col">
                            {['breakfast', 'lunch', 'dinner'].map(type => {
                                const slotId = `${dateStr}_${type}`;
                                const item = mealPlan[slotId];

                                return (
                                    <div key={type} className="flex-1 min-h-[100px]">
                                        <DroppableMealSlot
                                            title={null}
                                            icon={null}
                                            slotId={slotId}
                                            currentRecipe={item}
                                            compact={true}
                                            onRemove={() => onRemove(slotId, item)}
                                            onAddClick={() => onAddClick(slotId)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


// --- Main Planner Component ---

const Planner = () => {
    const { user } = useAuth();
    // --- View State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [plannerMode, setPlannerMode] = useState('daily'); // 'daily' | 'weekly'

    // --- Data State ---
    const [mealPlan, setMealPlan] = useState({});
    const [savedRecipes, setSavedRecipes] = useState([]);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetSlotId, setTargetSlotId] = useState(null);

    // --- Optimization Refs ---
    const lastFetchedRangeRef = React.useRef(null);
    const abortControllerRef = React.useRef(null);

    // Format Date for display (e.g., "Senin, 23 Okt 2023")
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    // Generate range key for deduplication
    const getRangeKey = (start, end) => {
        return `${start.toDateString()}_${end.toDateString()}`;
    };

    // Load Data
    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                // Load Saved Recipes
                const { fetchBookmarkedRecipes } = await import('../lib/recipeService');
                const bookmarks = await fetchBookmarkedRecipes(user.id);
                setSavedRecipes(bookmarks);

                // Load Meal Plans with deduplication
                const { fetchMealPlans } = await import('../lib/mealPlanService');

                // Determine range based on mode (optimally fetch month or week)
                // For simplicity, fetching a wide range around current date (e.g., +/- 1 month)
                const start = new Date(currentDate);
                start.setDate(start.getDate() - 30);
                const end = new Date(currentDate);
                end.setDate(end.getDate() + 30);

                const rangeKey = getRangeKey(start, end);

                // Skip fetch if same range was already fetched (deduplication)
                // 🔴 CRITICAL: Check BEFORE doing anything else
                if (lastFetchedRangeRef.current === rangeKey) {
                    console.log('🟢 Meal plan range already fetched, skipping...');
                    return;
                }

                // 🔴 CRITICAL: SET ref BEFORE fetch to guard against StrictMode double-mount
                lastFetchedRangeRef.current = rangeKey;

                // Cancel any in-flight requests
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                const plans = await fetchMealPlans(user.id, start, end);
                setMealPlan(plans);
                console.log('✅ Meal plans fetched for range:', rangeKey);

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('🟡 Meal plan fetch cancelled');
                } else {
                    console.error('Error loading planner data:', error);
                }
            }
        };
        loadData();
    }, [user, currentDate, plannerMode]); // Reload when view changes significantly or user changes

    // Handlers
    const handleAddClick = (slotId) => {
        setTargetSlotId(slotId);
        setIsModalOpen(true);
    };

    const addToPlan = async (slotId, recipe) => {
        // Optimistic Update
        setMealPlan(prev => ({
            ...prev,
            [slotId]: {
                id: recipe.id,
                name: recipe.title,
                image: recipe.main_image_url || 'https://placehold.co/600x400',
                isPending: true
            }
        }));

        const [dateStr, type] = slotId.split('_');
        const date = new Date(dateStr);

        try {
            const { addToMealPlan } = await import('../lib/mealPlanService');
            const { data, error } = await addToMealPlan({
                userId: user.id,
                date,
                slotType: type,
                recipeId: recipe.id
            });

            if (error) throw error;

            // Update with real DB data (especially ID for deletion)
            setMealPlan(prev => ({
                ...prev,
                [slotId]: {
                    ...prev[slotId],
                    itemId: data.id,
                    isPending: false
                }
            }));

        } catch (error) {
            console.error('Failed to add to meal plan:', error);
            // Revert on error
            setMealPlan(prev => {
                const next = { ...prev };
                delete next[slotId];
                return next;
            });
            alert('Gagal menambahkan ke jadwal.');
        }
    };

    const handleModalSelect = (recipe) => {
        if (targetSlotId) {
            addToPlan(targetSlotId, recipe);
            setIsModalOpen(false);
            setTargetSlotId(null);
        }
    };

    const handleRemove = async (slotId, item) => {
        if (!item) return;

        // Optimistic Remove
        setMealPlan(prev => {
            const next = { ...prev };
            delete next[slotId];
            return next;
        });

        if (item.itemId) {
            try {
                const { removeFromMealPlan } = await import('../lib/mealPlanService');
                await removeFromMealPlan(item.itemId);
            } catch (error) {
                console.error('Failed to remove:', error);
                // Could revert here if critical
            }
        }
    };

    // --- Drag and Drop Logic ---
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    );

    const [activeDragItem, setActiveDragItem] = useState(null);

    const handleDragStart = (event) => {
        if (event.active.data.current?.type === 'Recipe') {
            setActiveDragItem(event.active.data.current.recipe);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (over && active.data.current?.recipe) {
            const slotId = over.id;
            const recipe = active.data.current.recipe;
            addToPlan(slotId, recipe);
        }
    };

    const getSlotId = (type) => {
        const dateStr = currentDate.toISOString().split('T')[0];
        return `${dateStr}_${type}`;
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Main Container */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark">

                {/* === Main Planner Area === */}
                <main className="flex-1 min-w-0 bg-background-light dark:bg-background-dark">
                    {/* Header Controls */}
                    <div className="sticky top-0 lg:top-16 z-20 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-6 border-b bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-extrabold tracking-tight text-[#1b130d] dark:text-white">
                                Meal Planner
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                                    className="flex items-center justify-center transition-colors rounded-full size-8 hover:bg-white dark:hover:bg-[#3e3228] text-[#9a6c4c] dark:text-white"
                                >
                                    <span className="material-symbols-outlined">first_page</span>
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
                                    className="flex items-center justify-center transition-colors rounded-full size-8 hover:bg-white dark:hover:bg-[#3e3228] text-[#9a6c4c] dark:text-white"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-2 font-bold text-[#9a6c4c] dark:text-white">
                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    <span>{formatDate(currentDate)}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
                                    className="flex items-center justify-center transition-colors rounded-full size-8 hover:bg-white dark:hover:bg-[#3e3228] text-[#9a6c4c] dark:text-white"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                                    className="flex items-center justify-center transition-colors rounded-full size-8 hover:bg-white dark:hover:bg-[#3e3228] text-[#9a6c4c] dark:text-white"
                                >
                                    <span className="material-symbols-outlined">last_page</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full gap-4 xl:w-auto xl:justify-end">
                            <div className="flex items-center p-1 bg-white dark:bg-[#342a22] rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                                <button
                                    onClick={() => setPlannerMode('daily')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${plannerMode === 'daily' ? 'bg-primary text-white shadow-md' : 'text-[#9a6c4c] dark:text-gray-300 hover:text-[#1b130d] dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">view_day</span>
                                    Harian
                                </button>
                                <button
                                    onClick={() => setPlannerMode('weekly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${plannerMode === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-[#9a6c4c] dark:text-gray-300 hover:text-[#1b130d] dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">calendar_view_week</span>
                                    Mingguan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {plannerMode === 'daily' ? (
                            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                                <DroppableMealSlot
                                    title="Sarapan"
                                    icon="bakery_dining"
                                    slotId={getSlotId('breakfast')}
                                    currentRecipe={mealPlan[getSlotId('breakfast')]}
                                    onRemove={() => handleRemove(getSlotId('breakfast'), mealPlan[getSlotId('breakfast')])}
                                    onAddClick={() => handleAddClick(getSlotId('breakfast'))}
                                />
                                <DroppableMealSlot
                                    title="Makan Siang"
                                    icon="lunch_dining"
                                    slotId={getSlotId('lunch')}
                                    currentRecipe={mealPlan[getSlotId('lunch')]}
                                    onRemove={() => handleRemove(getSlotId('lunch'), mealPlan[getSlotId('lunch')])}
                                    onAddClick={() => handleAddClick(getSlotId('lunch'))}
                                />
                                <DroppableMealSlot
                                    title="Makan Malam"
                                    icon="dinner_dining"
                                    slotId={getSlotId('dinner')}
                                    currentRecipe={mealPlan[getSlotId('dinner')]}
                                    onRemove={() => handleRemove(getSlotId('dinner'), mealPlan[getSlotId('dinner')])}
                                    onAddClick={() => handleAddClick(getSlotId('dinner'))}
                                />
                            </div>
                        ) : (
                            <WeeklyCalendar
                                currentDate={currentDate}
                                mealPlan={mealPlan}
                                setMealPlan={setMealPlan}
                                getSlotId={getSlotId}
                                onAddClick={handleAddClick}
                                onRemove={handleRemove}
                            />
                        )}
                    </div>
                </main>

                {/* === Sidebar (Sticky & Scrollable) === */}
                <aside className="w-[calc(100%-2rem)] mx-4 mb-8 lg:mx-0 lg:mr-6 lg:mb-6 lg:w-96 flex-shrink-0 border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark flex flex-col lg:sticky lg:top-24 lg:h-[calc(100vh-8.5rem)] rounded-2xl shadow-xl overflow-hidden self-start">
                    <div className="py-4 text-sm font-bold text-center text-primary bg-orange-50/40 dark:bg-orange-900/10 border-b-2 border-primary transition-colors">
                        Tersimpan
                    </div>

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">

                        {/* --- SAVED ITEMS TAB --- */}
                        <div className="flex flex-col min-h-full">
                            <div className="p-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark sticky top-0 z-10">
                                {/* Added Header as requested */}
                                <h3 className="text-base font-extrabold text-[#1b130d] dark:text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">collections_bookmark</span>
                                    Koleksi Resep
                                </h3>

                                <div className="relative w-full mb-3">
                                    <span className="absolute text-xl -translate-y-1/2 material-symbols-outlined left-3 top-1/2 text-[#9a6c4c] dark:text-gray-400">search</span>
                                    <input
                                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#fcfaf8] dark:bg-[#342a22] border border-border-light dark:border-border-dark focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                        placeholder="Cari resep tersimpan..."
                                        type="text"
                                    />
                                </div>
                                <p className="text-xs font-medium text-[#9a6c4c] dark:text-gray-300">Tarik resep atau klik Tambah di jadwal.</p>
                            </div>

                            <div className="flex-1 p-3 space-y-2">
                                {savedRecipes.map((recipe) => (
                                    <DraggableRecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                                {savedRecipes.length === 0 && (
                                    <div className="text-center py-10 px-4">
                                        <p className="text-sm text-gray-500">Belum ada resep yang disimpan. Tandai resep sebagai favorit untuk muncul di sini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Drag Overlay */}
            {createPortal(
                <DragOverlay>
                    {activeDragItem ? (
                        <div className="p-2 rounded-xl bg-white dark:bg-surface-dark border border-primary shadow-lg cursor-grabbing w-64 opacity-90 rotate-3">
                            <div className="flex gap-3">
                                <div
                                    className="size-14 rounded-lg bg-cover bg-center flex-shrink-0"
                                    style={{ backgroundImage: `url("${activeDragItem.main_image_url || 'https://placehold.co/100x100'}")` }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#1b130d] dark:text-white text-xs truncate">
                                        {activeDragItem.title}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}

            {/* Recipe Selection Modal */}
            <RecipeSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleModalSelect}
                savedRecipes={savedRecipes}
            />

        </DndContext>
    );
};

export default Planner;
