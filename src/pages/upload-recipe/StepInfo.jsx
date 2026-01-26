import React, { useState, useEffect } from 'react';
import { useRecipe } from '../../context/RecipeContext';
import { fetchRegions } from '../../lib/recipeService';

const StepInfo = ({ onNext }) => {
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

    useEffect(() => {
        const loadRegions = async () => {
            const data = await fetchRegions();
            setRegions(data);
            setLoadingRegions(false);
        };
        loadRegions();
    }, []);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMainImagePreview(reader.result);
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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-left">
                <h1 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-tight">Bagikan Resep Andalanmu</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">Mulai dengan informasi dasar untuk memperkenalkan hidangan spesial Anda kepada komunitas.</p>
            </div>

            <div className="flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark bg-white dark:bg-[#2d231b]">
                {/* Main Image */}
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
                        <input accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={handleMainImageChange} />
                    </div>
                </div>

                {/* Title & Desc */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-main dark:text-white">Nama Resep *</label>
                    <input className="w-full rounded-xl p-4 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Rendang Daging" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-main dark:text-white">Cerita</label>
                    <textarea className="w-full rounded-xl p-4 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary/50" placeholder="Ceritakan sejarah..." rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                {/* Regions */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-main dark:text-white">Asal Daerah</label>
                    <div className="flex flex-wrap gap-2">
                        {loadingRegions ? <span className="text-sm">Memuat...</span> :
                            regions.map(r => (
                                <button key={r.id} onClick={() => handleRegionSelect(r)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${regionId === r.id ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border-light dark:border-border-dark'}`}>
                                    {r.name}
                                </button>
                            ))
                        }
                    </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex justify-end pt-6 border-t border-border-light dark:border-border-dark">
                    <button onClick={onNext} className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2">
                        Lanjut ke Bahan <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepInfo;
