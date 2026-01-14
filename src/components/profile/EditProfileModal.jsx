import React from 'react';

const EditProfileModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#342a22] w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#342a22] sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-text-main dark:text-white">Edit Profil</h2>
                        <p className="text-xs text-text-secondary dark:text-[#9a6c4c]">Perbarui informasi profil Anda</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-text-secondary dark:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
                    <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center pb-4">
                            <div className="relative group cursor-pointer p-1.5 bg-gray-50 dark:bg-[#2A2018] rounded-full shadow-inner">
                                <div className="size-28 md:size-32 rounded-full bg-cover bg-center border-4 border-white dark:border-[#3e3228] shadow-md relative overflow-hidden"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALm9SaB074MMWFc5lPj87OCVunpllCVYpf_Ed-ZiOMC8Zb3Eqz6s4geKHvPlNnL8S3KJK6MugN2qmaxUR2IvKabz_7EZosU3Y7fibGG1D7o_VT4aoF4H-4pmRW2MyIdu1Zv8pQE5_Sj3V6Oisdp0T-eMi0sn1FbcDxMeNMPKrlZdkvJMLhRiWQYZcLqlHm2xQSiGk2NvqyAQo2I67EakG2y6eVrOVYpAd4YMKTHrGBF-Ucgttrxg4BPzKlm0TwPsAiyfFI2kbrioQ6")' }}>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                        <span className="material-symbols-outlined text-white text-2xl font-light">add_a_photo</span>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 text-[11px] font-bold text-primary uppercase tracking-widest">Ubah Foto Profil</p>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="Nama Depan" defaultValue="Budi" icon="badge" />
                            <InputField label="Nama Belakang" defaultValue="Santoso" icon="badge" />
                            <InputField label="Username" defaultValue="budisantoso_chef" icon="alternate_email" prefix="@" />
                            <InputField label="Lokasi" defaultValue="Jakarta, Indonesia" icon="location_on" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-text-secondary dark:text-[#9a6c4c] uppercase tracking-wider ml-1">Tentang Saya</label>
                            <textarea
                                rows="3"
                                defaultValue="Enthusiastic home chef exploring authentic flavors of Indonesia one dish at a time."
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#2A2018] border-2 border-transparent focus:bg-white dark:focus:bg-[#1e1610] focus:border-primary/40 outline-none text-sm text-text-main dark:text-white transition-all resize-none placeholder-gray-400"
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2A2018]/50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-bold text-text-secondary dark:text-[#9a6c4c] hover:bg-gray-200 dark:hover:bg-white/5 transition-colors text-sm"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95 text-sm"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, icon, prefix, ...props }) => (
    <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary dark:text-[#9a6c4c] uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 dark:text-[#9a6c4c]/50 text-[20px] group-focus-within:text-primary transition-colors">{icon}</span>
            </div>
            {prefix && (
                <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-medium text-sm">{prefix}</span>
                </div>
            )}
            <input
                {...props}
                className={`w-full ${prefix ? 'pl-12' : 'pl-11'} pr-4 py-2.5 bg-gray-50 dark:bg-[#2A2018] border-2 border-transparent rounded-2xl text-sm text-text-main dark:text-white focus:bg-white dark:focus:bg-[#1e1610] focus:border-primary/40 outline-none transition-all`}
            />
        </div>
    </div>
);

export default EditProfileModal;
