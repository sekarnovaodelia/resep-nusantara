import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
// import { fetchRegions } from '../lib/uploadHelpers';

const UploadRecipeStep1 = () => {
    const navigate = useNavigate();
    const {
        title, setTitle,
        description, setDescription,
        mainImageFile, setMainImageFile,
        mainImagePreview, setMainImagePreview,
        regionId, setRegionId,
        regionName, setRegionName,
    } = useRecipe();

    const [regions, setRegions] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);

    // Mock regions data
    const MOCK_REGIONS = [
        { id: '1', name: 'Jawa Barat' },
        { id: '2', name: 'Jawa Tengah' },
        { id: '3', name: 'Jawa Timur' },
        { id: '4', name: 'Sumatera Barat' },
        { id: '5', name: 'Bali' },
        { id: '6', name: 'Sulawesi Selatan' },
        { id: '7', name: 'Aceh' },
        { id: '8', name: 'Kalimantan Barat' }
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setRegions(MOCK_REGIONS);
            setLoadingRegions(false);
        }, 500);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegionSelect = (region) => {
        if (regionId === region.id) {
            setRegionId(null);
            setRegionName('');
        } else {
            setRegionId(region.id);
            setRegionName(region.name);
        }
    };

    const handleNext = () => {
        if (!title.trim()) {
            alert('Nama resep harus diisi!');
            return;
        }
        navigate('/upload-recipe/step-2');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Secondary Header / Action Bar */}
            <div className="sticky top-0 z-20 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark py-3">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="flex items-center justify-center text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-all size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">Upload Resep</h2>
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center py-6 px-4 w-full max-w-3xl mx-auto">
                <div className="w-full mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-text-main dark:text-white text-lg font-bold leading-normal">Langkah 1: Info Dasar</p>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium leading-normal">1 dari 3</p>
                        </div>
                        <div className="relative w-full h-2 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out" style={{ width: '33.33%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mt-1 px-1">
                            <span className="text-primary font-bold">Info Dasar</span>
                            <span className="">Bahan & Langkah</span>
                            <span className="">Media & Preview</span>
                        </div>
                    </div>
                </div>

                {/* Main Content - Fluid Card */}
                <div className="w-full mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1 text-left">
                            <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Bagikan Resep Andalanmu</h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Mulai dengan informasi dasar untuk memperkenalkan hidangan spesial Anda kepada komunitas.</p>
                        </div>

                        <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">
                            {/* Main Image Upload */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-text-main dark:text-white">Foto Utama Hidangan</label>
                                <div className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8 gap-4 group overflow-hidden">
                                    {mainImagePreview ? (
                                        <>
                                            <img src={mainImagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-bold">Ganti Foto</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="size-16 rounded-full bg-white dark:bg-surface-dark shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                            </div>
                                            <div>
                                                <p className="text-text-main dark:text-white font-bold text-lg">Tarik dan lepas foto di sini</p>
                                                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Gunakan foto landscape berkualitas tinggi untuk hasil terbaik</p>
                                            </div>
                                            <button className="mt-2 px-6 py-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-bold text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-border-dark transition-colors" type="button">
                                                Pilih File
                                            </button>
                                        </>
                                    )}
                                    <input
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            {/* Recipe Name */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-text-main dark:text-white" htmlFor="recipe-name">Nama Resep *</label>
                                <input
                                    className="w-full rounded-xl text-text-main dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-medium transition-all outline-none"
                                    id="recipe-name"
                                    placeholder="Contoh: Rendang Daging Sapi Otentik Minang"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-text-main dark:text-white" htmlFor="recipe-story">Cerita di Balik Resep</label>
                                <textarea
                                    className="w-full rounded-xl text-text-main dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary px-4 py-3 text-sm transition-all resize-none outline-none"
                                    id="recipe-story"
                                    placeholder="Ceritakan sejarah, inspirasi, atau kenangan dari resep ini..."
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Region Selection */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-text-main dark:text-white">Asal Daerah</label>
                                <div className="flex flex-wrap gap-2">
                                    {loadingRegions ? (
                                        <span className="text-text-secondary text-sm">Memuat daerah...</span>
                                    ) : regions.length > 0 ? (
                                        regions.map((region) => (
                                            <button
                                                key={region.id}
                                                type="button"
                                                onClick={() => handleRegionSelect(region)}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${regionId === region.id
                                                    ? 'border-primary bg-primary/10 text-primary font-bold'
                                                    : 'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-secondary hover:border-primary/50'
                                                    }`}
                                            >
                                                {region.name}
                                                {regionId === region.id && (
                                                    <span className="material-symbols-outlined text-sm ml-1">close</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-text-secondary text-sm">Belum ada data daerah</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                            <div className="flex w-full sm:w-auto gap-3">
                                <button
                                    type="button"
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main dark:text-white font-bold hover:bg-background-light dark:hover:bg-background-dark transition-colors text-sm"
                                >
                                    Simpan Draft
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-sm"
                                >
                                    Lanjut ke Bahan
                                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadRecipeStep1;
