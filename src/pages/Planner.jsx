import React, { useState, useMemo } from 'react';
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

// --- Mock Data ---

const MOCK_SAVED_RECIPES = [
    {
        id: 'recipe-1',
        name: 'Nasi Goreng Kampung',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB80UvNrkJi1WhsjYIVDkkb-UUUEzu85gAhv6KCRbEQnKoGqjNxia42Kl-DLsb5DGDmGrSlG5AFzqRovf65QHHhDI1npo7jAGaHgrMXt289GBtTYmQiq1Jv5Lk1FBFykjMmhMZANPnLq0TiedInzbs2PBuV0mLzO7V9OzZ6KS0nu5q43Cw1ktyRVKE1sycgTgxYHvr56-mnKb-2NHhjGX7zhZaNqdpq9RGZX2jhmYAnz4lePysmhR9UcmWCDgB1B7g2PI9LIUXjr69F',
        time: '20m',
        portion: 2,
        ingredients: [
            { name: 'Nasi Putih', qty: '2 piring' },
            { name: 'Bawang Merah', qty: '3 siung' },
            { name: 'Telur', qty: '2 butir' }
        ],
        tags: ['Indonesian', 'Quick']
    },
    {
        id: 'recipe-2',
        name: 'Sate Ayam Madura',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwqUGcL0-1Wo13jNSmHZ5TWOMJrrNbyVFeCLHNTa-3Wfz_Yl6WCdLK9X7usNaKDZ1rQRFgRVAzPaBI8QH2OVMhYcK7jn3uat0cmZynv0y_1vCQUzlF7DSrO1BHvZ3ohR9nkb8V26Gf2ZdV8HlOeXqVFQCMW35hlwAOF5MMhJSMeGQZEHeSlF9fHHaURVP8KFLsjUEVtLyZo4uQDSR9pNPCewvaJ-CnptOAnK0QFJslJn6O16F0GnXFdiPlwkf9DQfV3p1Lyehv0EcS',
        time: '50m',
        portion: 4,
        ingredients: [
            { name: 'Dada Ayam', qty: '500g' },
            { name: 'Bumbu Kacang', qty: '1 pak' },
            { name: 'Kecap Manis', qty: '100ml' }
        ],
        tags: ['Protein', 'BBQ']
    },
    {
        id: 'recipe-3',
        name: 'Gado-Gado Special',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc_uqe8IFIF7djCqXXBemBNUgkBgd_Wl4b_p3aD-r0lqldSqpOqZLkoZUFsoi0bI-E5G_hKjAceoDNZ7im5M0c2yVqZjKxcUL1lSygeM_z5wqjLyMP_7qGP4OVGSmqVjxaCNIq5CUv1n9HC8-RTKlbtH4q2fSnw8y99Y07RV9Wrzs1riN2bT1HO5sNoH7H1b6Z3tcB3r4kq9n2-xzAZlst34WAGhSwmkbk8QVYlp0HO-X5wlIo1t6Pg2qkKlBBBbylEJA5uWEG9-D0',
        time: '30m',
        portion: 2,
        ingredients: [
            { name: 'Tahu', qty: '2 potong' },
            { name: 'Tempe', qty: '2 potong' },
            { name: 'Bumbu Kacang', qty: '1 pak' },
            { name: 'Sayuran Campur', qty: '300g' }
        ],
        tags: ['Veggie', 'Healthy']
    },
    {
        id: 'recipe-4',
        name: 'Bubur Ayam Jakarta',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCso2LaEMafR9j8XQCbbNyEODVemTKLxY3CvGnHBfEJa08mwp7_vv0j7O-pHBpWJYd8iWWL9BmHcIJ3uHxhCq0Gd-AFfkinzcoyqQvvSMZirabQcOKki1FD4OX9bpUpLF6HASODsuupZGA86dkpjFTyL2kk-_AWwT2Bxd4VpvhmUNluMrFven5NWyY8KtGBMfDRNjZ-ISCwcuq5TCNDFZfJ8m725wMUitG1UkT05Eaq3R58OQNUzIo63p0byJHmnm04VOse5NpD351m',
        time: '45m',
        portion: 2,
        ingredients: [
            { name: 'Beras', qty: '200g' },
            { name: 'Dada Ayam', qty: '200g' },
            { name: 'Kerupuk', qty: '1 pak' }
        ],
        tags: ['Indonesian', 'Comfort']
    }
];

// --- Modal Component ---

const RecipeSelectionModal = ({ isOpen, onClose, onSelect }) => {
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
                    {MOCK_SAVED_RECIPES.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => onSelect(recipe)}
                            className="flex items-center gap-4 p-3 bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark hover:border-primary cursor-pointer transition-all shadow-sm group"
                        >
                            <div
                                className="size-16 rounded-lg bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url("${recipe.image}")` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#1b130d] dark:text-white text-base group-hover:text-primary transition-colors">{recipe.name}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[#9a6c4c] dark:text-gray-300 font-medium">
                                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">person</span> {recipe.portion} Porsi</span>
                                </div>
                            </div>
                            <button className="size-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-primary bg-orange-50 dark:bg-orange-900/20 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>
                    ))}
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
                    style={{ backgroundImage: `url("${recipe.image}")` }}
                ></div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1b130d] dark:text-white text-sm leading-tight">
                        {recipe.name}
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
                    <div className={`group bg-white dark:bg-surface-dark border border-primary/20 dark:border-border-dark rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col relative ${compact ? 'h-full' : 'h-48'}`}>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url("${currentRecipe.image}")` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </div>

                        <button
                            onClick={onRemove}
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

const WeeklyCalendar = ({ currentDate, mealPlan, setMealPlan, getSlotId, onAddClick }) => {
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

                                return (
                                    <div key={type} className="flex-1 min-h-[100px]">
                                        <DroppableMealSlot
                                            title={null}
                                            icon={null}
                                            slotId={slotId}
                                            currentRecipe={mealPlan[slotId]}
                                            compact={true}
                                            onRemove={() => {
                                                const newPlan = { ...mealPlan };
                                                delete newPlan[slotId];
                                                setMealPlan(newPlan);
                                            }}
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
    // --- View State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentISODate = currentDate.toISOString().split('T')[0];

    // Format Date for display (e.g., "Senin, 23 Okt 2023")
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    const [plannerMode, setPlannerMode] = useState('daily'); // 'daily' | 'weekly'

    // --- Meal Data State ---
    const [mealPlan, setMealPlan] = useState({
        [`${new Date().toISOString().split('T')[0]}_breakfast`]: MOCK_SAVED_RECIPES[3],
    });

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetSlotId, setTargetSlotId] = useState(null);

    const handleAddClick = (slotId) => {
        setTargetSlotId(slotId);
        setIsModalOpen(true);
    };

    const handleModalSelect = (recipe) => {
        if (targetSlotId) {
            setMealPlan(prev => ({
                ...prev,
                [targetSlotId]: recipe
            }));
            setIsModalOpen(false);
            setTargetSlotId(null);
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

            setMealPlan((prev) => ({
                ...prev,
                [slotId]: recipe,
            }));
        }
    };



    // --- Render Helpers ---

    const getSlotId = (type) => `${currentISODate}_${type}`;

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
                                    onRemove={() => {
                                        const newPlan = { ...mealPlan };
                                        delete newPlan[getSlotId('breakfast')];
                                        setMealPlan(newPlan);
                                    }}
                                    onAddClick={() => handleAddClick(getSlotId('breakfast'))}
                                />
                                <DroppableMealSlot
                                    title="Makan Siang"
                                    icon="lunch_dining"
                                    slotId={getSlotId('lunch')}
                                    currentRecipe={mealPlan[getSlotId('lunch')]}
                                    onRemove={() => {
                                        const newPlan = { ...mealPlan };
                                        delete newPlan[getSlotId('lunch')];
                                        setMealPlan(newPlan);
                                    }}
                                    onAddClick={() => handleAddClick(getSlotId('lunch'))}
                                />
                                <DroppableMealSlot
                                    title="Makan Malam"
                                    icon="dinner_dining"
                                    slotId={getSlotId('dinner')}
                                    currentRecipe={mealPlan[getSlotId('dinner')]}
                                    onRemove={() => {
                                        const newPlan = { ...mealPlan };
                                        delete newPlan[getSlotId('dinner')];
                                        setMealPlan(newPlan);
                                    }}
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
                                {MOCK_SAVED_RECIPES.map((recipe) => (
                                    <DraggableRecipeCard key={recipe.id} recipe={recipe} />
                                ))}
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
                                    style={{ backgroundImage: `url("${activeDragItem.image}")` }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#1b130d] dark:text-white text-xs truncate">
                                        {activeDragItem.name}
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
            />

        </DndContext>
    );
};

export default Planner;
