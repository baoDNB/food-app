'use client';

import { p } from 'framer-motion/client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CafeForm from '../CafeForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CafeDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [place, setPlace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Popup


    const fetchDetail = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${apiUrl}/api/places/${id}`);
            const data = await res.json();
            setPlace(data);
        } catch (e) {
            console.error("Lỗi lấy dữ liệu:", e);
        } finally {
            setLoading(false);
        }
    };

    // 2. Gọi hàm khi component mount
    useEffect(() => {
        setIsMounted(true);
        fetchDetail();
    }, [id]);

    if (!isMounted || loading) return <div className="h-screen flex items-center justify-center bg-[#fdf9f6]">Đang tải không gian...</div>;
    if (!place) return <div className="p-20 text-center">Không tìm thấy quán.</div>;

    // Tính toán tiến độ checklist
    const exp = place.experience || {};
    const checklist = [
        { label: "Đã đến quán rồi nè", checked: !!exp.is_visited },
        { label: `Thử món signature (${place.signature_name || 'Latte Trứng'})`, checked: !!exp.tried_signature },
        { label: "Đã check-in tấm hình đẹp", checked: !!exp.took_photo },
        { label: "Chắc chắn sẽ quay lại", checked: !!exp.will_return },
    ];
    const progress = (checklist.filter(i => i.checked).length / 4) * 100;

    return (
        <div className="min-h-screen bg-[#fdf9f6] font-body text-[#1e1b18] pb-20">
            {/* 1. Hero Image */}
            <div className="h-[400px] relative">
                <img src={place.image_url} className="w-full h-full object-cover" alt={place.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={() => setIsModalOpen(true)} // Thay vì router.push
                        className="bg-white/90 hover:bg-white text-[#ab3500] px-6 py-2.5 rounded-full flex items-center gap-2 shadow-xl transition-all font-bold"
                    >
                        <span className="material-symbols-outlined text-base">edit</span>
                        Chỉnh sửa quán
                    </button>
                </div>
                <div className="absolute bottom-8 left-0 right-0 max-w-6xl mx-auto px-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {(() => {
                            const categoryOptions = [
                                { label: 'Chill một mình', icon: '🍃' },
                                { label: 'Hẹn hò', icon: '❤️' },
                                { label: 'Sống ảo', icon: '📸' },
                                { label: 'Tụ tập bạn bè', icon: '🍻' },
                                { label: 'Học bài', icon: '📚' },
                            ];

                            // --- ĐOẠN FIX QUAN TRỌNG NHẤT Ở ĐÂY ---
                            let categories: string[] = [];

                            try {
                                if (typeof place.category === 'string') {
                                    // Nếu là chuỗi "['A', 'B']", biến nó thành mảng thực thụ
                                    categories = JSON.parse(place.category);
                                } else if (Array.isArray(place.category)) {
                                    categories = place.category;
                                }
                            } catch (e) {
                                // Nếu parse lỗi, coi như nó là một chuỗi đơn lẻ
                                categories = place.category ? [place.category] : [];
                            }
                            // --- KẾT THÚC ĐOẠN FIX ---

                            return categories.map((catLabel: string, index: number) => {
                                const currentCat = categoryOptions.find(
                                    opt => opt.label.toLowerCase() === catLabel.toLowerCase()
                                ) || { label: catLabel, icon: '✨' };

                                return (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2 border border-white/30"
                                    >
                                        <span className="text-sm">{currentCat.icon}</span>
                                        {currentCat.label}
                                    </span>
                                );
                            });
                        })()}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{place.name}</h1>
                    <p className="text-white/90 flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> {place.address}{place.district && `, ${place.district}`}{place.city && `, ${place.city}`}</p>
                    <p className="text-white/90 flex items-center gap-2"><span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span> {place.opening_hours} - {place.closing_hours}</p>
                </div>

            </div>

            <div className="max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CỘT TRÁI: Nội dung chính */}
                <div className="lg:col-span-2 space-y-10">

                    {/* A. Checklist trải nghiệm */}
                    <section className="bg-[#fff3ed] p-8 rounded-3xl border border-orange-100">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">📓</span>
                            <h2 className="text-xl font-bold text-[#ab3500]">Checklist trải nghiệm</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {checklist.map((item, i) => (
                                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${item.checked ? 'bg-white border-orange-300' : 'bg-white/50 border-transparent'}`}>
                                    <span className={`material-symbols-outlined ${item.checked ? 'text-orange-600' : 'text-gray-300'}`}>
                                        {item.checked ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    <span className={item.checked ? 'text-gray-800' : 'text-gray-400'}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <p className="text-xs italic text-gray-500 mb-2">Hoàn thành {progress}% chặng đường</p>
                            <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </section>

                    {/* B. Vibe ở đây thế nào? */}
                    <section>
                        <h2 className="text-xl font-bold mb-6">Vibe ở đây thế nào?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <VibeSlider label="Âm thanh" left="Yên tĩnh" right="Ồn ào" val={place.vibe_sound} icon="volume_up" desc="Thích hợp học tập & làm việc" />
                            <VibeSlider label="Mật độ" left="Chill" right="Rất đông" val={place.vibe_density} icon="groups" desc="Vừa đủ thoải mái" />
                            <VibeSlider label="Phù hợp" left="Cá nhân" right="Đi nhóm" val={place.vibe_fit} icon="person" desc="Bàn lớn cho hội bạn thân" />
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold mb-6">Chú ý đáng nhớ</h2>
                        <div className="relative flex-1 bg-white p-5 rounded-2xl border border-orange-50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)] min-h-[100px]">
                            <p className="font-['Caveat',cursive] text-2xl text-zinc-700 leading-tight pt-1 line-clamp-3">
                                {place.description || place.thoughts || "Hôm nay mình đã có một kỷ niệm thật đẹp tại đây..."}
                            </p>
                        </div>
                    </section>

                    {/* C. Góc chụp xinh (GALLERY) */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Góc chụp xinh</h2>
                            <button className="text-orange-700 text-sm font-bold">Xem tất cả →</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
                                    <img src={`https://picsum.photos/400/400?random=${i + id}`} className="w-full h-full object-cover hover:scale-110 transition" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: Sidebar */}
                <div className="space-y-6">

                    {/* D. Món gợi ý (MENU) */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold flex items-center gap-2 mb-6"><span className="text-orange-600">✂</span> Món gợi ý</h3>
                        <div className="space-y-5">
                            <MenuItem name="Latte Trứng Signature" price="55k" desc="Kem trứng béo ngậy, cafe đậm đà" />
                            <MenuItem name="Croissant Hạnh Nhân" price="45k" desc="Nướng nóng mỗi sáng, giòn tan" />
                            <MenuItem name="Matcha Đá Xay" price="65k" desc="Trà Nhật xịn, vị đậm đà" />
                        </div>
                        <button className="w-full mt-6 py-3 border border-green-800 text-green-800 rounded-xl font-bold text-sm">📖 Xem Menu đầy đủ</button>

                    </div>

                    {/* E. Thông tin thêm */}
                    <div className="bg-[#f2efe9] p-6 rounded-3xl space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thông tin thêm</h4>
                        <InfoItem icon="wifi" text="Wifi cực mạnh (Pass: chulanh2024)" />
                        <InfoItem icon="local_parking" text="Gửi xe máy miễn phí trước cửa" />
                        <InfoItem icon="payments" text="Chấp nhận Thẻ & Chuyển khoản" />
                        <InfoItem icon="pets" text="Thân thiện với thú cưng" />
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Lớp nền mờ đen */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Khung nội dung trắng */}
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#ab3500]">Chỉnh sửa không gian</h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Gọi Component Form vào đây */}
                        <CafeForm
                            initialData={place}
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={() => {
                                setIsModalOpen(false);
                                fetchDetail(); // Load lại data trang detail sau khi sửa
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Components nhỏ trợ giúp
function VibeSlider({ label, left, right, val, icon, desc }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <div className="flex justify-between text-[10px] font-bold uppercase mb-4 text-gray-400">
                <span className="bg-gray-100 px-2 py-0.5 rounded">{label}</span>
                <span className="material-symbols-outlined text-sm">{icon}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold mb-1">
                <span>{left}</span>
                <span className="text-orange-700">{right}</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full relative">
                <div className="absolute h-3 w-3 bg-orange-700 rounded-full border-2 border-white -top-1 shadow" style={{ left: `${val}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-4 italic">{desc}</p>
        </div>
    );
}

function MenuItem({ name, price, desc }: any) {
    return (
        <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                <img src="https://picsum.photos/100/100?coffee" className="object-cover" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start font-bold text-xs">
                    <span>{name}</span>
                    <span className="text-orange-700">{price}</span>
                </div>
                <p className="text-[10px] text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function InfoItem({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 text-[11px] text-gray-600">
            <span className="material-symbols-outlined text-orange-700 text-sm">{icon}</span>
            <span>{text}</span>
        </div>
    );
}