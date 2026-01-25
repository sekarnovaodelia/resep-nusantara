import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedCard from '../components/FeedCard';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dummy data matching Community.jsx (in a real app, this would be fetched from an API)
    const posts = [
        {
            id: 1,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5H8-WRyDVCmTAJlsUe7Csv1_FswYOA5vII1hUx-UGSNl_ypN3yGeFw54WKzwztvu6XcBhafv-6CwQ6BZErZNj4awwHcTOuIk-PDdq7h9H3GqZDx5T3zxY4b5ElTONswXzqVwsZ99yTBXop_KYIPt6Cx5Hfi7vjXkCdmUP0GzrzjFrOgrT0uZMGO9lwi0jE3TnZnJPsYwkeY-_xvKV6rie2koAGaQivxS3S62JNAH9o0xFpQzuUHUaLANxzJkXFX_MPmNUbKHhKyn2",
            name: "Siti Aminah",
            time: "2 jam yang lalu",
            location: "Jakarta",
            content: <>Akhirnya berhasil bikin Rendang yang empuk banget setelah percobaan ke-3! Rahasianya ternyata di santan kental yang dimasak perlahan. 😍 <span className="text-primary font-medium">#MasakanRumahan #RendangPadang</span></>,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdFUNPmf4Ot4SVouhTqKFu8kiYzvEHGPJU3YZMlqQVun1vkaTd6tKa-LNkC1QTjcXGlgSVxOAFJvGOg1s3aFQXshJWQ810vAnNhB5izkSmh07BUhA8rMEfT9bHr1l1K-zCMHZIRsy0kBvZUL20XJh6jXJWJBy0NbG99wd9akI10lO6mka4O35an6YXAr2XOD1E6ntZmNjB9Iw6XJ5zdUBEBIdjTrA-FW5acWxBShArpcnct79xKsCSMApDHRXhr_k7hy-r--BWwftR",
            recipeTitle: "Rendang Daging Sapi Empuk",
            recipeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpMEZQpqbKcgZ8fN2rp3USICjP3M-61jRkiN0eEVG2PWKCpAXn1zZvXZogKydST7GDozqnKx2lgeksj5mK3uqixvjgatR8LSFBw_tpoWLdtWsVEHPMTZTh4a7tZ2eqfxRK1qDk92DlCWWj3NjFUekfeRAXPGjFzbmT7zwCIIzYPqVlJNoXNeUqL0OVLLGA_ue-atMlAziZqyGSCCM4ZEzNl4dkdPAnYJtMdZ0TvTA_Hha6RAYA5dzTH9I2M-yTtIiIFNTUCGUMfr_A",
            recipeId: "1", // Added dummy recipeId
            likes: 2400,
            comments: 142,
            initialLiked: true
        },
        {
            id: 2,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJKNjAKTjtgePs5upaANtlQak7h9MfgqefiHk8UtzXsOEsX_koP1HV2eumHSICTYGusis3uVnCIza54-2rHqpLLK5wJs7BixvGsvsgl-VAPqpCMecAc9oxCtqCkpaZRyPaTss7KxH0XJ1anh3MmtAlIvH9--DqCBvYyo4fAanLxYZZPtJJr5EQSQGjMqueSM5OqBdOw4aLBAlALIW0-95p4W3flidWv99b6oi0mkZph4_uaVkjcdqui5XlSb4bH0llSrbdEhOzw2VtAlUjFp",
            name: "Dimas Anggara",
            time: "5 jam yang lalu",
            location: "Bandung",
            content: <>Sarapan simpel tapi nikmat: Nasi Goreng Kampung pakai pete! Siapa tim pete di sini? 🙌 <span className="text-primary font-medium">#Sarapan #NasiGoreng</span></>,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6k0Xw8FLmxP9dqEspyBqDpSMzvzLJtoBjmu0TRq6g6ZHtLwedjVjgL4GL2vd_Er6lg8Vg1h8X_UIjPMzAKjBbklk0DQOxSij7MQIwqOLPOnw2YnWLjcouF61jlSwyYKnpr4q2lacX3rXGMsZgwEk-peyQP_73sNtzYUvaxSicBE8rZFJxZWA95mGXlFupWngMFzkJ_ZNVssgJV-bnwjA3mQGwJh7a9HoN8Cg80IJBH6nvY4rQl8q7JMjhVdTuq_-XNBkmz8IAmGK5",
            recipeTitle: "Nasi Goreng Kampung Spesial",
            recipeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOFxVsfRGOOiKKSG5smY9grR-LeaV1BqSMqhOJrUp9NvKmzkZV9r77h1lOe81-a9xatEEQRuJ1pRUhe1Z9eUDUwWAEz_XFYwR8Xa32_T6NHvPNqTcJXbHJ4qjyNgzhBzs85cAEC3jLLOiZn4L8I01vjf5KCC7jqHbhDboVRqaQ6dJooz79IbprDz_SAVD6S7weLT09hoNc6eaxVUmJoTMaVK8lQAAgQIfB2cSAc-vosSEArwyoCYIfx4fNEwPebjF0QXROeGh-qL9a",
            recipeId: "3", // Added dummy recipeId
            likes: 856,
            comments: 45
        }
    ];

    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <p className="text-lg text-gray-500 mb-4">Postingan tidak ditemukan</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-bold"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:pt-1 sm:pb-8">
            <div className="max-w-3xl mx-auto">
                {/* Header for Post Detail */}
                <div className="flex items-center gap-3 px-3 py-2 mb-1 sticky top-0 bg-background-light dark:bg-background-dark z-10 sm:static sm:bg-transparent">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold text-text-main dark:text-white leading-none">Post</h1>
                </div>

                <FeedCard {...post} isDetailView={true} />
            </div>
        </div>
    );
};

export default PostDetail;
