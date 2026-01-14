import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-12 pt-16 pb-8 bg-background-light dark:bg-background-dark border-t border-primary/10">
            <div className="layout-container max-w-[1440px] mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined !text-3xl">restaurant</span>
                            <h2 className="text-text-main dark:text-white text-xl font-bold">Resep Nusantara</h2>
                        </div>
                        <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                            Platform komunitas kuliner terbesar di Indonesia. Menghubungkan pecinta masakan Nusantara
                            melalui resep autentik dan cerita di balik setiap hidangan.
                        </p>
                        <div className="flex gap-4">
                            <a className="w-10 h-10 rounded-full bg-accent dark:bg-accent-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-accent dark:bg-accent-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined text-lg">photo_camera</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-accent dark:bg-accent-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined text-lg">smart_display</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-text-main dark:text-white text-lg relative w-fit after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-primary after:rounded-full">
                            Jelajahi
                        </h4>
                        <div className="flex flex-col gap-3">
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Resep Terbaru</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Resep Populer</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Kategori Pilihan</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Koleksi Spesial</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Video Masak</a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-text-main dark:text-white text-lg relative w-fit after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-primary after:rounded-full">
                            Perusahaan
                        </h4>
                        <div className="flex flex-col gap-3">
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Tentang Kami</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Karir</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Hubungi Kami</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Mitra & Partner</a>
                            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Kebijakan Privasi</a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-text-main dark:text-white text-lg relative w-fit after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-accent-pandan after:rounded-full">
                            Unduh Aplikasi
                        </h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Masak lebih mudah dengan aplikasi Resep Nusantara.</p>
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-3xl">android</span>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase">Get it on</div>
                                    <div className="text-sm font-bold leading-none">Google Play</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-3xl">phone_iphone</span>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase">Download on the</div>
                                    <div className="text-sm font-bold leading-none">App Store</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-secondary dark:text-gray-500">© 2023 Resep Nusantara. All rights reserved.</p>
                    <div className="flex gap-6 text-xs text-text-secondary dark:text-gray-500">
                        <a className="hover:text-primary" href="#">Syarat & Ketentuan</a>
                        <a className="hover:text-primary" href="#">Kebijakan Cookie</a>
                        <a className="hover:text-primary" href="#">Peta Situs</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
