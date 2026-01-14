import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 lg:px-8">
            {/* Lightbox for Ingredients */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Detail Bahan"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link to="/recipes" className="hover:text-primary transition-colors">Main Course</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-text-main dark:text-gray-200 font-medium">Rendang Daging</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                {/* Image Section */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuonMqfbD4UwTdSTu_S07nedh_XNT-eRqd4uMOH83FSqmdVOS1mh0Kknq9Zo8LZNGM83y8hj2mFKAi0T70JNoKKhYXJcrkopvift42INd31KGrA_Qf-fmKcvgOvfdDiiaXy3lhdTPm5fvC3KZGJUA9lnD5guGkbtMBbxVE5x7r86nOXR9p4tpSHAi2SDGpmt56BdB9JfA81T3vT67T7uriRAZ8vy1GYG9s6mlK7icqqvB5J9mIL3pw-x7M8LDOEjtgBq6zctdsATV4')" }}
                        ></div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm p-2 rounded-full text-text-main dark:text-gray-200 hover:text-primary hover:scale-110 transition-all shadow-sm">
                                <span className="material-symbols-outlined">favorite</span>
                            </button>
                            <button className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm p-2 rounded-full text-text-main dark:text-gray-200 hover:text-primary hover:scale-110 transition-all shadow-sm">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Top Rated</span>
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                    <span className="text-sm font-bold text-text-main dark:text-gray-200">4.9</span>
                                    <span className="text-xs text-text-secondary dark:text-gray-400">(245 Ulasan)</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main dark:text-white leading-tight mb-4">
                                Rendang Daging Sapi Khas Padang
                            </h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
                                Resep rendang asli Payakumbuh yang dimasak perlahan dengan santan kental dan rempah-rempah pilihan hingga bumbu meresap sempurna dan daging menjadi sangat empuk.
                            </p>

                            {/* Chef Info */}
                            <div className="flex items-center gap-3 mb-6 p-3 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark">
                                <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiudVFcBmZ9AfmiNoLPKubaTtsZW3IkqNPN5VVx5viH8zqJBcEB6zfyxrL0fzs5v3kx4u1iVtBHOTjmK5gZ0u_piHfwNVBKMw2Im7ftgTnDi-sTIwWIleVxi35QdeUpfVCD-qV1rD2FU7A4E36bPUuK4Vr73a9puWe-eEnahuT0DP4Pmnp1_8IemxOISLa3s772NecnAxz-RIYFfg-owYOBl_qz7UlITLiwNfsNjxP74nggi3hroxH18Iwstcqxy6cvjOqNXf4BJE2')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-white">Chef Siti</p>
                                    <p className="text-xs text-text-secondary dark:text-gray-400">Padang, Indonesia</p>
                                </div>
                                <button className="text-primary text-sm font-bold px-3 py-1.5 hover:bg-primary/10 rounded-lg transition-colors">
                                    Follow
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="flex flex-col items-center justify-center p-3 bg-background-light dark:bg-background-dark rounded-xl text-center border border-border-light dark:border-border-dark">
                                    <span className="material-symbols-outlined text-primary mb-1">schedule</span>
                                    <span className="text-xs text-text-secondary dark:text-gray-400">Waktu</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white">4 Jam</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-background-light dark:bg-background-dark rounded-xl text-center border border-border-light dark:border-border-dark">
                                    <span className="material-symbols-outlined text-primary mb-1">signal_cellular_alt</span>
                                    <span className="text-xs text-text-secondary dark:text-gray-400">Level</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white">Sulit</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-background-light dark:bg-background-dark rounded-xl text-center border border-border-light dark:border-border-dark">
                                    <span className="material-symbols-outlined text-primary mb-1">local_fire_department</span>
                                    <span className="text-xs text-text-secondary dark:text-gray-400">Kalori</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white">450 kkal</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to={`/recipe/${id}/cook`}
                            className="w-full bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 text-white text-lg font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group"
                        >
                            <span className="material-symbols-outlined group-hover:animate-bounce">skillet</span>
                            MULAI MASAK
                        </Link>
                    </div>
                </div>
            </div>

            {/* Ingredients & Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Ingredients Column */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Bahan-bahan</h3>
                            <div className="text-xs font-medium text-text-secondary bg-background-light dark:bg-background-dark px-2 py-1 rounded-lg">6 Porsi</div>
                        </div>

                        {/* Serving Size Control */}
                        <div className="space-y-1 mb-6">
                            <div className="flex items-center justify-between text-sm text-text-secondary dark:text-gray-400 mb-2">
                                <span>Serving size</span>
                                <div className="flex items-center gap-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-1">
                                    <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-text-main dark:text-white font-bold">-</button>
                                    <span className="font-bold text-text-main dark:text-white">6</span>
                                    <button className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-text-main dark:text-white font-bold">+</button>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients List */}
                        <div className="space-y-3">
                            <div
                                className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuB67xcJUYWjnORyqdhX1iKur3PsWE9RyCLEqR3K6sJDezy9CJhUi8lED343HjLzClpOkgpS2ksmecvI8b_CpQrtOl1LzMqH2KWRqXCHJYkAaFfSCrq-o_12De12Av7RkdFjVw7rKehVSgCp9wPklRVq0IXY6Q5uSxW6HEK7ZpVcHnmD6K7vptHyCb4clm5Nui1vVrv8PMmKi_M28vbsPLVa-pueLi4nXG1Q0CnLTx50WVVXr85UsInQ8eUL9aUzNrZ3wL55EI3-WSA2')}
                            >
                                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB67xcJUYWjnORyqdhX1iKur3PsWE9RyCLEqR3K6sJDezy9CJhUi8lED343HjLzClpOkgpS2ksmecvI8b_CpQrtOl1LzMqH2KWRqXCHJYkAaFfSCrq-o_12De12Av7RkdFjVw7rKehVSgCp9wPklRVq0IXY6Q5uSxW6HEK7ZpVcHnmD6K7vptHyCb4clm5Nui1vVrv8PMmKi_M28vbsPLVa-pueLi4nXG1Q0CnLTx50WVVXr85UsInQ8eUL9aUzNrZ3wL55EI3-WSA2')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">1 kg</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">Daging Sapi (Paha Belakang)</p>
                                </div>
                            </div>
                            <div
                                className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAh6A-Nh1MIWkrvKXYivUzvgwK26Tf65tzprk5m0lrawetAwiXmSuD-BuPrcDqM3e8OfboHUXLD1TiNj1N9LcOsKZf9NIVVXI5WLdax7gS6ZRd3fL0gE7_NXwJiifFhe_BOhu2rYkG9Y_6_N6JFTBn48dkoP7XTPZAXZ36n-XDK17vf7Oly7hOs7C7wXf6FaUjNdJLI9Egl7FOSl66Gx3nQBy5swKV6a5cxnQtrm8U_-yzbNJWqXZ2OL8oe3Oy8njq6qizuHAnkqS3Z')}
                            >
                                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAh6A-Nh1MIWkrvKXYivUzvgwK26Tf65tzprk5m0lrawetAwiXmSuD-BuPrcDqM3e8OfboHUXLD1TiNj1N9LcOsKZf9NIVVXI5WLdax7gS6ZRd3fL0gE7_NXwJiifFhe_BOhu2rYkG9Y_6_N6JFTBn48dkoP7XTPZAXZ36n-XDK17vf7Oly7hOs7C7wXf6FaUjNdJLI9Egl7FOSl66Gx3nQBy5swKV6a5cxnQtrm8U_-yzbNJWqXZ2OL8oe3Oy8njq6qizuHAnkqS3Z')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">1.5 Liter</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">Santan Kelapa Murni</p>
                                </div>
                            </div>
                            <div
                                className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuChDVwXM_FQZvTE1VISTxJBbfWr6aBn9wW1jDe4yF6Ra2hlA0FLoMdEYeW5mIDbc860sQlkiWctBS6aKXuWbLYR8t-fUCV26XcYIPRTAE3j-iVlwq-bNKQb7Ipbof1vB_BB5w1y-DffAZ-EJ-LZef1ohUyuY-w93LoeXs70soUC8Tnc8U0N_OwaHcvlna187GUa5xURW_u65pIsMNZjanXKsxgfOA210jMMaIYeqojk2jMCkwd1jCX6yNX_6MIsAJujw4Gx2GtB06mV')}
                            >
                                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChDVwXM_FQZvTE1VISTxJBbfWr6aBn9wW1jDe4yF6Ra2hlA0FLoMdEYeW5mIDbc860sQlkiWctBS6aKXuWbLYR8t-fUCV26XcYIPRTAE3j-iVlwq-bNKQb7Ipbof1vB_BB5w1y-DffAZ-EJ-LZef1ohUyuY-w93LoeXs70soUC8Tnc8U0N_OwaHcvlna187GUa5xURW_u65pIsMNZjanXKsxgfOA210jMMaIYeqojk2jMCkwd1jCX6yNX_6MIsAJujw4Gx2GtB06mV')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">100 gr</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">Bumbu Halus (Bawang, Jahe, Lengkuas)</p>
                                </div>
                            </div>
                            <div
                                className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBw3zou8SjdKISijq8csyHkiWe21d_oH5F4H7_mhsD0rdI5_5QthmTjIdYdxTcOjio-TVf51DHc436HH1c7WImaGvdQrea8TRy5nmWncfD3PKVninGamfkNz-RK-R0uYE3pMYPEM0dzjzdXCYWGDkM8HvBWWEOP_2ILu0iWOMX0rfFwgIvb_1qQEpNH0y-7fOVmsBVmwt4dwhyb40flsEBYtYKn7bkLh_E-GJoQZAGsxEfWjN9JQz67DI1_5unV1DcSEnPtEgBrz22U')}
                            >
                                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw3zou8SjdKISijq8csyHkiWe21d_oH5F4H7_mhsD0rdI5_5QthmTjIdYdxTcOjio-TVf51DHc436HH1c7WImaGvdQrea8TRy5nmWncfD3PKVninGamfkNz-RK-R0uYE3pMYPEM0dzjzdXCYWGDkM8HvBWWEOP_2ILu0iWOMX0rfFwgIvb_1qQEpNH0y-7fOVmsBVmwt4dwhyb40flsEBYtYKn7bkLh_E-GJoQZAGsxEfWjN9JQz67DI1_5unV1DcSEnPtEgBrz22U')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">2 Batang</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">Serai (Memarkan)</p>
                                </div>
                            </div>
                            <div
                                className="flex items-start gap-4 p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/10"
                                onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAi_fVmeTox92DYXejK3lCjbQ-1suQVG4AhR7bDTVO10lj2t4mFjPX_WrgKLEy3uiD4rkYtF48UItVVm-cycdlC5NJQEhLbXbnpML8D7YUifHVSv_XmGAUem5W4Vtz6P2_sxoKJ_Mp1sYhVXZQpsAjlcXIEs88oF4V3m1mCS4ynEYF51CHP_9XxAk_qiS-vycSPhhO_zhacEKt5cjXDtSABcnslH9Lm1CaEPY9cEJj83VLNpFrP6QS-6xTcZIU5hzr9-vwVFJo1elb5')}
                            >
                                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAi_fVmeTox92DYXejK3lCjbQ-1suQVG4AhR7bDTVO10lj2t4mFjPX_WrgKLEy3uiD4rkYtF48UItVVm-cycdlC5NJQEhLbXbnpML8D7YUifHVSv_XmGAUem5W4Vtz6P2_sxoKJ_Mp1sYhVXZQpsAjlcXIEs88oF4V3m1mCS4ynEYF51CHP_9XxAk_qiS-vycSPhhO_zhacEKt5cjXDtSABcnslH9Lm1CaEPY9cEJj83VLNpFrP6QS-6xTcZIU5hzr9-vwVFJo1elb5')" }}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main dark:text-gray-200 group-hover:text-primary transition-colors">4 Lembar</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">Daun Jeruk</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Methods Column */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">Cara Membuat</h2>
                            <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">print</span> Print Resep
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/30 z-10">1</div>
                                    <div className="w-0.5 h-full bg-border-light dark:bg-border-dark mt-2 group-last:hidden"></div>
                                </div>
                                <div className="flex-1 pb-8">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">Persiapan Daging</h4>
                                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed mb-4">Potong daging sapi melebar searah serat atau bentuk kotak dadu sesuai selera. Pastikan daging dicuci bersih dan dikeringkan dengan tisu dapur agar bumbu lebih mudah meresap.</p>
                                    <div className="w-full h-48 sm:h-64 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCATb8yL_w4t4R-EU21KPY1jH4bLPCacS8qMdGV-Ad8E2bIJ9iER4o3ZcRW1E2YnmjXYnbmd0mcs1hhhtU4Fc8-JptNLKCbVQY14v6vt1-kbiP3NAJ2JHL3VXeHCFkUgv_gkdEFBOcFgbAgxW5T4zAdpq7JyU58A3elnucMOugKtcx_Y9pt8xvpmOY6P0aoO0fyrd0R41eH9XfD4twfOiAbDGbuM2GXvyfskDCahJGKwWSL8DfH8sIScgEGg6s13l9kpqLG6V11aFrb')" }}></div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/30 z-10">2</div>
                                    <div className="w-0.5 h-full bg-border-light dark:bg-border-dark mt-2 group-last:hidden"></div>
                                </div>
                                <div className="flex-1 pb-8">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">Tumis Bumbu Halus</h4>
                                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed mb-4">Panaskan sedikit minyak, tumis bumbu halus, serai, daun kunyit, dan daun jeruk hingga harum dan matang. Masukkan santan kental, aduk terus agar santan tidak pecah hingga mendidih.</p>
                                    <div className="w-full h-48 sm:h-64 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUtmVxQrrlth1abszVRI0BFgWgX1wsY16cma8-E1EFum1nMC-4YsjdnRBOEmYMquwmK7mOW7mWJRaOe3xbMWSEXsuMkL8XwzKr8erphqkLTNx5XmEMPSeqqblCpWhTXWIYaFLU_ilTZ3taYZtNrgeoU9S4k7gNZyjhO0fMKQsngB8t1XeyfUIIvnkTuoJnGbMNhTWAGmxhTvteOcj10FdhyV_gv0sSAwtLeycgEKLOWaCh4W3whIs5yFxeQHm04VR14ye116pqjMb1')" }}></div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/30 z-10">3</div>
                                    <div className="w-0.5 h-full bg-border-light dark:bg-border-dark mt-2 group-last:hidden"></div>
                                </div>
                                <div className="flex-1 pb-8">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">Proses Pemasakan</h4>
                                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed mb-4">Masukkan daging sapi. Masak dengan api kecil sambil sesekali diaduk agar tidak gosong di bagian bawah. Masak hingga santan menyusut dan mengeluarkan minyak (menjadi kalio). Teruskan memasak hingga daging berwarna coklat gelap dan bumbu kering (rendang).</p>
                                    <div className="w-full h-48 sm:h-64 rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUF1hv2E2EdNotNZI5bpGOx_oOuL55lWWv427nqpMoJTzrgo68q8Z8VJsd5taaenFR4zhnoyM-MWn73t1x8RPpIMQ5bKdK-5n4svCdPpUmSjHl7PHTT8YM9eoHis1LbnASuMZADTz3l6yd7G26-8Z-XEXrkSbmAg2KxtWJTABdD4eQ66ilf17TqbAyx-RcWfnLidiv3ahduPdRiqv_oOzr9lSNwlm00_rPdTOUGCa8IgXM_px9NJOh_0PkFtEsMUnQ7s5SbklMhTzv')" }}></div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border-2 border-primary text-primary flex items-center justify-center font-bold text-sm z-10">4</div>
                                    <div className="w-0.5 h-full bg-transparent mt-2"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">Sajikan</h4>
                                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed">Angkat dan tiriskan minyak berlebih. Rendang siap disajikan dengan nasi hangat. Rendang ini bisa tahan lama jika disimpan dalam wadah tertutup di kulkas.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mt-10 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500">lightbulb</span>
                            <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Tips Chef Siti:</strong> Jika ingin daging lebih empuk, bisa menggunakan presto selama 30 menit sebelum dimasak dengan santan hingga kering.
                            </div>
                        </div>
                    </div>

                    {/* Community Cooksnaps & Comments (Merged section styling for simplicity in code) */}
                    <div className="mt-8 bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                <h3 className="text-xl font-bold text-text-main dark:text-white">Cooksnaps Komunitas</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-text-secondary dark:text-gray-400 font-medium">12 Orang sudah mencoba</span>
                                <button className="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/20 hover:border-primary/50">
                                    Lihat Semua
                                </button>
                            </div>
                        </div>

                        {/* Cooksnap Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
                            {/* Item 1 */}
                            <div className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGz_oRCILm5GmrESFqbxT4RC7T25C_jADdoteI4oNwzqrpKmuIdqaAH79Es0hMhw34x0-QblG0QsD98nmkL0mivk8Y8NMaKPza6Hl1ILhjg7YW9728ygWCH7g-EXQmws7zvOrej2ppK-yGMTJdvcONeVNAMJzhjvdokfbTvH_Hmb29DfJ1CP_tUbfOPjCwgvkYaYwNi-gfmWMFdODKMMCg3eQ-U7WUeltsmaVM9HgtyjaosI93Yz1oUePjxLAIdZHsWuS7iJ1qTr10')" }}></div>
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm z-10">
                                    <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-blue-500 fill-current">verified</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-text-main dark:text-white leading-none whitespace-nowrap">Verified Cook</span>
                                </div>
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                                    <span className="material-symbols-outlined text-[10px] sm:text-[12px] fill-current text-white">favorite</span> 12
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9nHev8DnARW4BTsrJ58tadd2wJFiAGC7fzrUZeS1FA00cuQhmzhP4Bm_lOfYS9WVFwU-YrtAUBjb-e5_0Kf4larmKAXUYDmC-wQtalMWgNjaJ23cCaZgU_L9iSkJcjqg7jknI07F-6SQOGJ3dUBiTdka3L1zxD_kiz9r56d6QBV1WvRwB9lCv8znM_d5-V88Ywd2VCuDYC8L0jYUuokwD77kWfyv8ypt1PKWwA4GJ7bCXd1cIDot95DON-3oODP0XR47qLrtURCZZ')" }}></div>
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm z-10">
                                    <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-blue-500 fill-current">verified</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-text-main dark:text-white leading-none whitespace-nowrap">Verified Cook</span>
                                </div>
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                                    <span className="material-symbols-outlined text-[10px] sm:text-[12px] fill-current text-white">favorite</span> 8
                                </div>
                            </div>
                            {/* Item 3 */}
                            <div className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBowqcTkz74T7aZy1RsXqnCLbbAixlI56x44J1I8qaQJLmwlPpE-TSiYV-nqL9G2GxutkIfII15_gW2axKqA1gbA7ZruPSnxY_8QPzoNRY4ntWExpuAqNvb2yDl8lVeeomDpds_WYCMyQ_TuGE63jc3iR-OQTSmfaMEuVpMaCxTg-ZpfFUDyTWO17zAu-_tJ-IK-wGyhDdXOMO085y7C1dL00-ztyqlWNIa7ku1TT0MzKF1X08t46GsXC23C-RaHDCQFYZ__vkc06GZ')" }}></div>
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm z-10">
                                    <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-blue-500 fill-current">verified</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-text-main dark:text-white leading-none whitespace-nowrap">Verified Cook</span>
                                </div>
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                                    <span className="material-symbols-outlined text-[10px] sm:text-[12px] fill-current text-white">favorite</span> 5
                                </div>
                            </div>
                            {/* Upload Button */}
                            <div className="aspect-square rounded-xl border-2 border-dashed border-primary/20 dark:border-primary/40 flex flex-col items-center justify-center text-text-secondary dark:text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-all bg-background-light dark:bg-background-dark group">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">add_a_photo</span>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Bagikan Foto</span>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-4 mb-10">
                            <div className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-border-light dark:border-border-dark shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiqDtJeWnJ9OhLuMNIiZ0I0_zAzrZt9yAG3ntXdZnJwEfAN89ug7RcNzaS-976NAu5dxcQc2BThU6BxkqIC_D-yMr6fxg5DkTlrdXblzjRBU_9BYyadvijb7JIIYw3hZ7iYtEeuxTpWgVa0XAcjl6-_6WMg3ICYmUqlFzEWkfJ5asn5xc89iNyBj_-nGI8xhvsvlBLXxtSrx48L_rIC7cgfk8_sxXY_uwa2cYE0jleP0W2FecQGzOugBcrmm4nTlloNQ5UVpj9HD9o')" }}></div>
                            <div className="flex-1 relative">
                                <textarea className="w-full rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark dark:text-white p-3 pb-10 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none placeholder:text-text-secondary/70 dark:placeholder:text-gray-500" placeholder="Bagikan pengalaman memasakmu atau tanya Chef Siti..." rows="3"></textarea>
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <button className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10">
                                        <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                                    </button>
                                    <button className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10">
                                        <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 right-3">
                                    <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm transition-all hover:shadow-primary/20">Kirim</button>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {/* Comment 1 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLzDwzcBvuOT_ltYBEGSDadqUkOhhsUKt2COMVzzG-mH-Ca_86ecV0B_hu7py8gxmVNC37jA2Ie4POwdsW8S6B1Oc22tAlOvvKeCqOzZ9iXG3WerL2ollLgC2S6BWe7WDFePG3Y153WfoGOawlPE0SYdEO6Lhc0tKOqk9TLWXMSg9PBaRcYx0_y65zJCW_C4pHDJW7OZFjzCUH8GAd8FiFYFSbLZESeG0CBXxn8oSc6J1X144k3r7as-VCe-zPehJ3sBJFz5sm8u6B')" }}></div>
                                <div className="flex-1">
                                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl rounded-tl-none border border-border-light dark:border-border-dark">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="font-bold text-sm text-text-main dark:text-white">Rina Sulastri</h5>
                                            <span className="text-xs text-text-secondary dark:text-gray-400">2 jam yang lalu</span>
                                        </div>
                                        <p className="text-sm text-text-main dark:text-gray-200 leading-relaxed">
                                            Suka banget sama resep ini! Dagingnya beneran empuk dan bumbunya meresap sampai ke dalam. Tips pakai prestonya sangat membantu buat yang ga punya banyak waktu 😍
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 ml-2">
                                        <button className="text-xs font-bold text-text-secondary dark:text-gray-400 hover:text-primary transition-colors">Balas</button>
                                        <button className="flex items-center gap-1 text-xs font-medium text-text-secondary dark:text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark px-2 py-0.5 rounded-full">
                                            ❤️ 5
                                        </button>
                                        <button className="flex items-center gap-1 text-xs font-medium text-text-secondary dark:text-gray-400 hover:text-orange-500 transition-colors bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark px-2 py-0.5 rounded-full">
                                            🔥 2
                                        </button>
                                        <button className="text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
                                            <span className="material-symbols-outlined text-[16px]">add_reaction</span>
                                        </button>
                                    </div>

                                    {/* Reply */}
                                    <div className="flex gap-3 mt-4">
                                        <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiudVFcBmZ9AfmiNoLPKubaTtsZW3IkqNPN5VVx5viH8zqJBcEB6zfyxrL0fzs5v3kx4u1iVtBHOTjmK5gZ0u_piHfwNVBKMw2Im7ftgTnDi-sTIwWIleVxi35QdeUpfVCD-qV1rD2FU7A4E36bPUuK4Vr73a9puWe-eEnahuT0DP4Pmnp1_8IemxOISLa3s772NecnAxz-RIYFfg-owYOBl_qz7UlITLiwNfsNjxP74nggi3hroxH18Iwstcqxy6cvjOqNXf4BJE2')" }}></div>
                                        <div className="flex-1">
                                            <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl rounded-tl-none border border-primary/10">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <h5 className="font-bold text-sm text-text-main dark:text-white">Chef Siti</h5>
                                                    <span className="material-symbols-outlined text-[14px] text-primary fill-current">verified</span>
                                                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full ml-1">Author</span>
                                                </div>
                                                <p className="text-sm text-text-main dark:text-gray-200">
                                                    Terima kasih Kak Rina! Senang mendengarnya. Selamat mencoba resep lainnya ya! 🙏
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 ml-2">
                                                <button className="text-xs font-bold text-text-secondary dark:text-gray-400 hover:text-primary transition-colors">Balas</button>
                                                <button className="flex items-center gap-1 text-xs font-medium text-text-secondary dark:text-gray-400 hover:text-blue-500 transition-colors bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark px-2 py-0.5 rounded-full">
                                                    👍 2
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comment 2 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmpEZ36dFKBJ7YpRZOcn_V-p-5SBuW73oF3P1q4RQcot7-JWug4b_vOl-2tBBKUBNowl2j55iGbAYtje07UxUhxyeMBElWr3-pdsxOAzijTjiP0k9rJuExZma3_YFneHnNXakMG63f-Zl3bHmUn46B6RzuEm6ejNNtzkv3Ex_QoGq0JPCn6y8IUUavOwMS78P5pBAEYh5k8upi2_2psAvDnOEsBDwqyLeP2rSew-uRI0YKQ9LGKL-q6CAZYljd_5e1oUMIvnBgKnRf')" }}></div>
                                <div className="flex-1">
                                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl rounded-tl-none border border-border-light dark:border-border-dark">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="font-bold text-sm text-text-main dark:text-white">Budi Santoso</h5>
                                            <span className="text-xs text-text-secondary dark:text-gray-400">5 jam yang lalu</span>
                                        </div>
                                        <p className="text-sm text-text-main dark:text-gray-200 leading-relaxed">
                                            Apakah santannya harus santan murni atau bisa pakai santan instan kemasan?
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 ml-2">
                                        <button className="text-xs font-bold text-text-secondary dark:text-gray-400 hover:text-primary transition-colors">Balas</button>
                                        <button className="text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
                                            <span className="material-symbols-outlined text-[16px]">add_reaction</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RecipeDetail;
