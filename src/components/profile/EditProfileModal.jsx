import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, profile, refreshProfile } = useAuth();

    // Form state
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Initialize form with current profile data
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setUsername(profile.username || '');
            setLocation(profile.location || '');
            setAvatarPreview(profile.avatar_url || null);
        } else if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setUsername(user.user_metadata?.username || '');
        }
    }, [profile, user, isOpen]);

    // Handle avatar file selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB');
                return;
            }
            setAvatarFile(file);
            setError('');
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Upload avatar to Supabase Storage
    const uploadAvatar = async () => {
        if (!avatarFile || !user) return null;

        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = fileName;

        console.log('🔵 Uploading avatar to:', filePath);

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, {
                contentType: avatarFile.type,
                upsert: true
            });

        if (error) {
            console.error('🔴 Avatar upload error:', error);
            throw error;
        }

        console.log('✅ Avatar uploaded:', data);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    };

    // Save profile changes
    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError('');

        try {
            let avatarUrl = profile?.avatar_url || null;

            // Upload new avatar if selected
            if (avatarFile) {
                avatarUrl = await uploadAvatar();
            }

            console.log('🔵 Updating profile...');

            // Upsert profile data
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    username: username,
                    location: location,
                    avatar_url: avatarUrl,
                }, { onConflict: 'id' });

            if (updateError) {
                console.error('🔴 Profile update error:', updateError);
                throw updateError;
            }

            console.log('✅ Profile updated successfully');

            // Refresh profile in context
            if (refreshProfile) {
                await refreshProfile();
            }

            onClose();
        } catch (err) {
            console.error('🔴 Save error:', err);
            setError(err.message || 'Gagal menyimpan perubahan');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const currentAvatarUrl = avatarPreview ||
        profile?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=EA6A12&color=fff`;

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
                    <form onSubmit={handleSave} className="space-y-8">

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center pb-4">
                            <div className="relative group cursor-pointer p-1.5 bg-gray-50 dark:bg-[#2A2018] rounded-full shadow-inner">
                                <div className="size-28 md:size-32 rounded-full bg-cover bg-center border-4 border-white dark:border-[#3e3228] shadow-md relative overflow-hidden"
                                    style={{ backgroundImage: `url("${currentAvatarUrl}")` }}>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                        <span className="material-symbols-outlined text-white text-2xl font-light">add_a_photo</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="mt-3 text-[11px] font-bold text-primary uppercase tracking-widest">Ubah Foto Profil</p>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField
                                label="Nama Lengkap"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                icon="badge"
                            />
                            <InputField
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                icon="alternate_email"
                                prefix="@"
                            />
                            <InputField
                                label="Lokasi"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                icon="location_on"
                                className="md:col-span-2"
                            />
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2A2018]/50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl font-bold text-text-secondary dark:text-[#9a6c4c] hover:bg-gray-200 dark:hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, icon, prefix, className = '', ...props }) => (
    <div className={`space-y-2 ${className}`}>
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
