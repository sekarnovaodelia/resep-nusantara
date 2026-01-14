import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(3);
    const [isWakeLockActive, setIsWakeLockActive] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const totalSteps = 8;
    const progress = (currentStep / totalSteps) * 100;

    const handleClose = () => {
        navigate(`/recipe/${id}`);
    };

    // Wake Lock Implementation
    useEffect(() => {
        let wakeLock = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                    setIsWakeLockActive(true);
                    console.log('Wake Lock is active');

                    wakeLock.addEventListener('release', () => {
                        setIsWakeLockActive(false);
                        console.log('Wake Lock released');
                    });
                }
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
                setIsWakeLockActive(false);
            }
        };

        requestWakeLock();

        const handleVisibilityChange = async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (wakeLock !== null) {
                wakeLock.release().catch(e => console.error(e));
                wakeLock = null;
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Top Navigation Bar (Distraction Free) */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f3ece7] dark:border-[#3a2c22] px-4 md:px-8 py-4 flex items-center justify-between shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleClose}
                        aria-label="Close Cooking Mode"
                        className="flex items-center justify-center size-12 rounded-full bg-white dark:bg-surface-dark border border-[#e7d9cf] dark:border-[#4a3b32] hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary transition-all duration-300 text-text-main dark:text-white group shadow-sm"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">close</span>
                    </button>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                Cooking Mode
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-text-main dark:text-white truncate max-w-[200px] md:max-w-md capitalize leading-tight">
                            {id?.replace('-', ' ')}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center">
                    {/* Screen Wake Lock Status Text - No Icon */}
                    {isWakeLockActive && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-xs font-bold tracking-wide">Layar Tetap Menyala</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12">
                {/* Progress Bar */}
                <div className="w-full mb-8 md:mb-12">
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-primary font-bold text-lg md:text-xl">
                            Langkah {currentStep} <span className="text-text-secondary dark:text-gray-400 font-medium text-base">dari {totalSteps}</span>
                        </p>
                        <p className="text-text-main dark:text-white font-medium text-base">{Math.round(progress)}%</p>
                    </div>
                    <div className="h-3 w-full bg-[#e7d9cf] dark:bg-[#3a2c22] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,109,19,0.4)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Layout Grid - Updated for Landscape */}
                <div className="grid grid-cols-1 lg:grid-cols-12 landscape:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left Column: Visuals & Timer */}
                    <div className="lg:col-span-5 landscape:col-span-5 flex flex-col gap-6">
                        {/* Large Step Image */}
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg bg-[#fcfaf8] dark:bg-[#2d211a] border border-[#f3ece7] dark:border-[#3a2c22]">
                            <div
                                className="absolute inset-0 bg-center bg-cover transition-transform duration-700 hover:scale-105"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuSk-EzRFgSgkTkouZkBaXjVe7ITxwWBdNFfuI8f1qYX64gAy-Amr5rhJSusGNeusKdNw9hEQDRy0OjvDBmszXMA0eZucIBNAv_6iPESs8TYQ9_1GzByhyaktyOGhzb6am4js9Ln2ckmAtQ5pvGQoHugMZ2su-MGxlGQNoFs3NHVioC7kINtemL6MjPoMvkq7viVfhwR1ViiV747Q_t0_tWKJ8GO6eujvKQprRLcTcqt32DTf0TqsDiUnituanByEOujgpcyKO16gL')" }}
                            ></div>
                        </div>

                        {/* Contextual Timer */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-[#f3ece7] dark:border-[#3a2c22]">
                            <div className="flex items-center gap-3 mb-4 text-text-main dark:text-white">
                                <span className="material-symbols-outlined text-primary">timer</span>
                                <h3 className="font-bold text-lg">Timer Masak</h3>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 flex flex-col items-center p-3 bg-background-light dark:bg-background-dark rounded-lg border border-[#e7d9cf] dark:border-[#4a3b32]">
                                    <span className="text-xl md:text-2xl font-bold text-text-main dark:text-white">00</span>
                                    <span className="text-[10px] md:text-xs text-text-secondary dark:text-gray-400 uppercase tracking-tighter">Jam</span>
                                </div>
                                <div className="flex items-center font-bold text-lg md:text-xl">:</div>
                                <div className="flex-1 flex flex-col items-center p-3 bg-background-light dark:bg-background-dark rounded-lg border border-[#e7d9cf] dark:border-[#4a3b32]">
                                    <span className="text-xl md:text-2xl font-bold text-text-main dark:text-white">30</span>
                                    <span className="text-[10px] md:text-xs text-text-secondary dark:text-gray-400 uppercase tracking-tighter">Menit</span>
                                </div>
                                <div className="flex items-center font-bold text-lg md:text-xl">:</div>
                                <div className="flex-1 flex flex-col items-center p-3 bg-background-light dark:bg-background-dark rounded-lg border border-[#e7d9cf] dark:border-[#4a3b32]">
                                    <span className="text-xl md:text-2xl font-bold text-text-main dark:text-white">00</span>
                                    <span className="text-[10px] md:text-xs text-text-secondary dark:text-gray-400 uppercase tracking-tighter">Detik</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className={`w-full mt-4 py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${isTimerRunning ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                            >
                                <span className="material-symbols-outlined icon-filled">{isTimerRunning ? 'pause' : 'play_arrow'}</span>
                                {isTimerRunning ? 'Pause Timer' : 'Mulai Timer'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Instructions */}
                    <div className="lg:col-span-7 landscape:col-span-7 flex flex-col justify-start h-full">
                        <div className="mb-2 inline-flex items-center gap-2">
                            <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">Langkah {currentStep}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-main dark:text-white leading-tight mb-8">
                            Masukkan Daging
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-xl md:text-2xl lg:text-3xl leading-[1.6] font-medium text-text-main dark:text-gray-200 mb-10">
                                Masukkan daging sapi yang telah dipotong-potong ke dalam wajan. <span className="text-primary font-semibold bg-primary/10 px-1 rounded">Aduk perlahan</span> hingga daging berubah warna dan bumbu meresap sempurna. Pastikan api dalam keadaan sedang.
                            </p>
                        </div>


                    </div>
                </div>
            </main>

            {/* Bottom Navigation Footer */}
            <footer className="sticky bottom-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-[#f3ece7] dark:border-[#3a2c22] p-4 md:p-6 lg:px-12 z-40">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Previous Button */}
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="w-full md:w-auto flex-1 md:flex-none md:min-w-[240px] h-16 rounded-xl border-2 border-[#e7d9cf] dark:border-[#4a3b32] hover:border-primary/50 hover:bg-[#f3ece7] dark:hover:bg-[#3a2c22] text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all flex items-center justify-center md:justify-start px-6 gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-70">Sebelumnya</span>
                            <span className="text-base md:text-lg font-bold text-text-main dark:text-white group-hover:text-primary truncate max-w-[150px] md:max-w-none">Tumis Bumbu</span>
                        </div>
                    </button>

                    {/* Keyboard Hint */}
                    <div className="hidden lg:flex items-center gap-8 text-sm text-text-secondary dark:text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-[#3a2c22] border border-gray-200 dark:border-gray-700 rounded-md text-xs">←</kbd>
                            <span>Back</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Next</span>
                            <kbd className="px-2 py-1 bg-white dark:bg-[#3a2c22] border border-gray-200 dark:border-gray-700 rounded-md text-xs">→</kbd>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                        disabled={currentStep === totalSteps}
                        className="w-full md:w-auto flex-1 md:flex-none md:min-w-[280px] h-16 rounded-xl bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 text-white transition-all flex items-center justify-center md:justify-between px-6 gap-3 group transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-90">Selanjutnya</span>
                            <span className="text-base md:text-lg font-extrabold truncate max-w-[150px] md:max-w-none">Tuang Santan</span>
                        </div>
                        <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default CookingMode;
