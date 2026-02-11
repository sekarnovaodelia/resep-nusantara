import React from "react";

const Footer = () => {
    // Foto member placeholder (bisa diganti url asli nanti)
    const team = [
        {
            name: "Sekar Nova",
            role: "Frontend Developer",
            img: "/team/sekar1.jpeg",
        },
        {
            name: "Arista Vania",
            role: "UI/UX Designer",
            img: "/team/arista.jpeg",
        },
        {
            name: "Syamil ikhsan",
            role: "Backend Developer",
            img: "/team/samil.jpeg",
        },
        {
            name: "Atha Yan",
            role: "Database Engineer",
            img: "/team/atha.jpeg",
        },
    ];

    return (
        <footer className="mt-auto pt-16 pb-8 bg-surface-light dark:bg-[#1E1611] border-t border-border-light dark:border-[#3E3228] transition-colors duration-200">
            <div className="container max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-16">

                    {/* Tentang Kami */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined text-4xl">restaurant_menu</span>
                            <h2 className="text-2xl font-black tracking-tight text-text-main-light dark:text-[#F3ECE7]">
                                Resep Nusantara
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-text-main-light dark:text-[#F3ECE7]">Tentang Kami</h3>
                            <p className="text-text-secondary dark:text-[#9C8E84] leading-relaxed max-w-md">
                                Platform berbagi resep masakan khas nusantara yang dibuat dengan cinta untuk melestarikan kuliner Indonesia.
                                Temukan, masak, dan bagikan kelezatan cita rasa asli Indonesia.
                            </p>
                        </div>
                    </div>

                    {/* Tim Kami (Foto Member) */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-text-main-light dark:text-[#F3ECE7]">Tim Kami</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {team.map((member, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="relative mb-3">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm text-text-main-light dark:text-[#F3ECE7] mb-1">
                                        {member.name}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-border-light dark:border-[#3E3228] text-center">
                    <p className="text-sm text-text-secondary dark:text-[#9C8E84]">
                        © {new Date().getFullYear()} Resep Nusantara. Dibuat untuk Project Sekolah.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
