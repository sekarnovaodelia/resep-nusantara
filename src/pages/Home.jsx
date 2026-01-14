import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="layout-container flex flex-col grow max-w-[1440px] mx-auto w-full px-4 md:px-10 py-5 gap-8">
            {/* Hero Section */}
            <section className="rounded-3xl bg-primary/10 dark:bg-accent-dark/50 p-6 md:p-10 relative overflow-hidden shadow-xl shadow-primary/5 border border-primary/10 dark:border-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 relative z-10 items-center">
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-white/90 dark:bg-white/10 backdrop-blur text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">Community Choice</span>
                                <div className="flex items-center text-yellow-600 dark:text-yellow-500 gap-1 text-sm font-bold bg-white/70 dark:bg-black/30 px-2 py-1 rounded-full shadow-sm">
                                    <span className="material-symbols-outlined icon-filled text-[16px]">star</span>
                                    <span>4.9</span>
                                </div>
                            </div>
                            <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                                Rendang Daging <span className="text-primary">Khas Padang</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiudVFcBmZ9AfmiNoLPKubaTtsZW3IkqNPN5VVx5viH8zqJBcEB6zfyxrL0fzs5v3kx4u1iVtBHOTjmK5gZ0u_piHfwNVBKMw2Im7ftgTnDi-sTIwWIleVxi35QdeUpfVCD-qV1rD2FU7A4E36bPUuK4Vr73a9puWe-eEnahuT0DP4Pmnp1_8IemxOISLa3s772NecnAxz-RIYFfg-owYOBl_qz7UlITLiwNfsNjxP74nggi3hroxH18Iwstcqxy6cvjOqNXf4BJE2")' }}></div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Oleh <span className="text-primary font-bold">Chef Siti</span></p>
                            </div>
                            <p className="text-text-secondary dark:text-gray-200 text-lg font-normal leading-relaxed">
                                "Resep rendang asli Payakumbuh yang dimasak perlahan dengan santan kental dan rempah-rempah pilihan hingga bumbu meresap sempurna."
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-text-main dark:text-white font-medium bg-white/80 dark:bg-white/10 p-4 rounded-xl backdrop-blur-sm w-fit shadow-sm border border-primary/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
                                <span>4 Jam</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">bar_chart</span>
                                <span>Sulit</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                                <span>6 Porsi</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">local_fire_department</span>
                                <span>450 kkal</span>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2">
                            <Link to="/recipe/rendang" className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-terracotta-dark transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30">
                                <span className="mr-2 material-symbols-outlined">restaurant_menu</span>
                                <span className="truncate">Lihat Resep</span>
                            </Link>
                            <button className="flex w-12 h-12 cursor-pointer items-center justify-center rounded-xl bg-background-light dark:bg-accent-dark hover:bg-accent dark:hover:bg-accent-dark/80 transition-colors text-text-main dark:text-white shadow-sm border border-primary/10">
                                <span className="material-symbols-outlined">bookmark</span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-0 bg-black/10 rounded-2xl rotate-3 transform transition-transform group-hover:rotate-6"></div>
                        <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-center bg-no-repeat bg-cover rounded-2xl shadow-xl relative z-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuonMqfbD4UwTdSTu_S07nedh_XNT-eRqd4uMOH83FSqmdVOS1mh0Kknq9Zo8LZNGM83y8hj2mFKAi0T70JNoKKhYXJcrkopvift42INd31KGrA_Qf-fmKcvgOvfdDiiaXy3lhdTPm5fvC3KZGJUA9lnD5guGkbtMBbxVE5x7r86nOXR9p4tpSHAi2SDGpmt56BdB9JfA81T3vT67T7uriRAZ8vy1GYG9s6mlK7icqqvB5J9mIL3pw-x7M8LDOEjtgBq6zctdsATV4")' }}>
                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">Paling Dicari</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-3/4 flex flex-col gap-8">
                    <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            <h2 className="text-text-main dark:text-white tracking-tight text-[28px] font-bold leading-tight">Jelajah Resep</h2>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-white">Populer</button>
                            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-accent dark:bg-accent-dark text-text-secondary dark:text-gray-400 hover:bg-primary/10 transition-colors">Terbaru</button>
                            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-accent dark:bg-accent-dark text-text-secondary dark:text-gray-400 hover:bg-primary/10 transition-colors">Mudah</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                        {/* Template Card */}
                        {[
                            { title: "Rendang Daging Sapi", region: "Sumatera Barat", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBegczIY9fT1we5PglobpC7-YLsIs-qPlyvyQYFdBmqFDKhqudXrj21hzzIQN2RDy3pEBFUhTi2sZljD77lX7WJxa6hixX1CuOg4NVdqPJBJZXdEEa9JoFzx6LND44BvO34HgKJSN2Yhmk-Wm4MzZWridhMxdSV4kcQmIVeb3kn-8tCJMYTtxPRIYd6kVQmNb8wAcuINqXwqwgxEU77RI8Q0_WHhFZdWc1ex3jv81o_CZ1qExPeC6z1nD0zJttERCloLshPVtL0lhta", time: "3h", difficulty: "Sulit", rating: "4.9", category: "Utama" },
                            { title: "Gudeg Jogja Komplit", region: "Yogyakarta", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfLfWNbeKeVj27uFovWIEjKL_Uu-6lCFFRs3QO_GQF93DeUHNMh2ufUj5jb06UAuRS8cewKnLh3I8MhCEHUclJkMkl0wAzp2YplujMmN8btUDgknEDxfJ55yLfI43HalYjxlkG8gwJU87t6LUaPMApaab-K1NHsAkGZDQjxEnlZnw2nxe3CuAhsT8Kw9S_aqXvbOILl9lXvKk-hlnLVUo33zQudZbX5w8lkmQQw08shLLu1L1qeSrFXI4yPZHLRNtvzEwHlhTnIJ8X", time: "2h", difficulty: "Sedang", rating: "4.8", category: "Tradisional" },
                            { title: "Soto Betawi Susu", region: "Jakarta", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmsImfgQ6cZgal1MTOkQXiE5nBdZnNI8_zrLEzDvbKKaRjJY92OarcqtN6RqmeqO8dWvkY-C2lOWphj8dC9f0EU5qu0EcziWKXHVLMa0v7cB7VaINrRmZQZjZMpiQCx30-Rwp5BMNBshmMHs-tdZ4Cl3hCGot5VEY4w5Tyn78lwCnBKz-J-MOz3715OeS98UvIz9AGUcTX4lLqce9kLJ_QtosQhxClR3MxWwtS-SCIijLpl3KgCuxfE-12xK5LS6q4ORRuFCqgfZLP", time: "1h", difficulty: "Sedang", rating: "4.7", category: "Kuah" },
                            { title: "Ayam Betutu Gilimanuk", region: "Bali", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm2MjQy3AR_W5VD7cEg6vzL3LOG-AAnNcRCsBZVhfBc3n03sKnZf9TUypXZiXe4aC1YlCTiXYGGcHyviFgpSErqgIs9onv-e9DmR1jHI7qQHA8mKpRU2Xm16O087OfIzJVerKV_I38OIGdX0ylWRiGQcmgaa55ugLADBJQ2KCwGFr-lCt3w0cUbtJSzLqA0i7ms9dEayUGdL354Q1trtkjtcHi1znkQsvvdMp5Xt1o0WNNewPkH24J16WLiv11CFLYk-qdiiMfMm4N", time: "1.5h", difficulty: "Sulit", rating: "4.8", category: "Pedas" },
                            { title: "Rawon Setan Surabaya", region: "Jawa Timur", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh54TTPlEV2lrMhz1Fh6worVBjqRQd1lbKpeLyidzEOpWlY2KCcW9DuuKLciV9J5bwR1GpDkfuUTK7IraTxNaypOLbWwOvIhqMtnAdcIIQw9d-wdSXf-CnTuGmvfjYxPjSCOesw0OwhXcahumfp6FvzQBY3kY7tAUJ1S-h_LXE66D4wEPQ9NpZIuMX0vzBEVGCovzmYS-lWbUh-CaJpufW37hf7j-M7kv12yBmf15NOZVm2syXd4T7o1ileYrLYFMgubhhy0WeDwuM", time: "2.5h", difficulty: "Sulit", rating: "4.6", category: "Sup" },
                            { title: "Pempek Palembang", region: "Sumatera Selatan", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Rv_RMpPFELKgHsjVNW9TC7QnJxIqB7CK8BYSdu8PvvyqGuto0R6PlzJL9AnQiu0gXdQunWsyohtEK_cLE2DossobYrPrNqXTWSJKnTbC58SicPDDn8ZCi4lkmgkpox9_oBxeAXfPLrbm7kOys3y_XfkO1fnlcF-6FUcgXiEYL90WG09FMmriLj4nC2YNaoyIbE531BHyzleYQcP6fq9m_ye_QHprnQKE5OTZsLdm_vRzETWUNfFuExXmBdWWunCha6_W99D7fA4E", time: "1.5h", difficulty: "Sedang", rating: "4.9", category: "Jajanan" },
                        ].map((recipe, idx) => (
                            <div key={idx} className="group flex flex-col gap-3 cursor-pointer">
                                <div className="w-full overflow-hidden rounded-2xl aspect-[4/3] relative shadow-md group-hover:shadow-xl transition-all duration-300">
                                    <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${recipe.img}")` }}></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 dark:bg-black/70 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-text-main dark:text-white">{recipe.category}</span>
                                    </div>
                                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur transition-colors text-white">
                                        <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                                    </button>
                                </div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">{recipe.title}</h3>
                                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-xs font-bold text-yellow-700 dark:text-yellow-500">
                                            <span className="material-symbols-outlined icon-filled text-[12px]">star</span> {recipe.rating}
                                        </div>
                                    </div>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span> {recipe.region}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 text-xs text-text-secondary dark:text-gray-500 font-medium">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {recipe.time}</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> {recipe.difficulty}</span>
                                        <span className="ml-auto text-primary font-bold">Lihat</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="w-full lg:w-1/4 flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                            <span className="material-symbols-outlined text-primary">public</span>
                            <h3 className="text-text-main dark:text-white tracking-tight text-xl font-bold leading-tight">Jelajah Rasa</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Sumatera', 'Jawa', 'Bali', 'Sulawesi', 'Kalimantan', 'Papua'].map((region) => (
                                <a key={region} className="px-4 py-2 rounded-full bg-background-light dark:bg-accent-dark border border-primary/10 text-sm font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition-all" href="#">{region}</a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-accent dark:bg-accent-dark/30 border border-primary/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-text-main dark:text-white tracking-tight text-lg font-bold leading-tight">Rekomendasi Chef</h3>
                            <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Lihat Semua</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { title: "Nasi Goreng Kampung", time: "20m", rating: "4.5", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuByg5jxqle7nHuppOMXhJdVandrhYIwOq7fTwtbeaba8yyTIiqU3TNyuCvQWF79BQ5NrtxpLXjpgXf_iunQW-e9P2kffyxRbBZGHTsXRn1PDX5HKVh5LAAB6tnvxACjc6m-ejxqHuVh4JQuT5JcS2PmRa3Blrnfc_L9D3iG6rEYpc_DkqH1SQdYAG-K9ShUzH54WEw_-9PpouzEbbggzLzaxQPXiezdbjKUbgVmVbyE8b3yTwr1XEGMEhPKUFtTJnqgYCa97428IAhE" },
                                { title: "Tempe Mendoan", time: "15m", rating: "4.8", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq9BZfNDAbOxyWKaJmPV8A0ut_YEb5MwXYj0Sd5gYmb0LZ6PZo15yW_sjAXwMX24jq2hKDk6mqoQ-7RhcyIorH-W2psmHPKCdcDTgW-uNO9fmgf2e69-XOeBRf6AdQA02dg8PAYz_00B4LXiUbVXmoZagpxKWhybSfc2ZyOH9hkJDikaIbtiDsW3Om0Jl17kalPJx1Vie92SDVSuZYhYzhaRph3hEPNiBm18Thtvf8Z3b3PkgOaVEmaq49apMdO5j2krXjR63ShLAd" },
                                { title: "Gado-gado Jakarta", time: "30m", rating: "4.7", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7lYrWtrPbruzvW2ATrVYDtO--w5q3GEp-UYRsXO-TAJtXq50JVRQlJyU2tfYLiX0UsQT1s3F0fdFhhxGDeLPYYyxjudvz9yfc-75-e5_SJTOmDCnoURvsGLZOMBpgBHPVuUG9_xdsN3WkObreWf1WY99HMDxsfB3v80Slfo3l92E0QQpJId3fdf22d20S44M4Ucs_I1TD-YOAnOyfHGwCSwe33iDOu9JjDUpNK9ynIK0H5Lx1JHmaBC7OtcbxQjNVAY_A519wtY8" },
                            ].map((chefRec, idx) => (
                                <div key={idx} className="flex gap-4 items-center group cursor-pointer bg-background-light dark:bg-accent-dark p-2 rounded-xl hover:shadow-md transition-all">
                                    <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${chefRec.img}")` }}></div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <h4 className="text-text-main dark:text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{chefRec.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-xs text-text-secondary dark:text-gray-500">
                                                <span className="material-symbols-outlined text-[14px] mr-1">timer</span> {chefRec.time}
                                            </div>
                                            <div className="flex items-center gap-0.5 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                                                <span className="material-symbols-outlined icon-filled text-[12px]">star</span> {chefRec.rating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Home;
