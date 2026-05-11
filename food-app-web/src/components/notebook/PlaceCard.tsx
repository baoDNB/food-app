'use client';

import Link from "next/link";
import { MapPin, CalendarDays, ArrowRight, Heart } from "lucide-react";
import axios from "axios";
import { i } from "framer-motion/client";

interface Place {
    id: number;
    name: string;
    address: string;
    image?: string;
    image_url?: string;
    emoji?: string;
    created_at?: string;
    description?: string;
    thoughts?: string;
    district?: string;
    city?: string;
    experience?: {
        will_return: boolean;
    };
}

interface PlaceCardProps {
    item: Place;
    index?: number;
    setPlaces?: React.Dispatch<React.SetStateAction<any[]>>;
    variant?: 'diary' | 'wishlist'; // Thêm prop để xác định giao diện
}

const formatDiaryDate = (isoString?: string) => {
    if (!isoString) return "Gần đây";
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const PlaceCard = ({ item, index = 0, setPlaces, variant = 'diary' }: PlaceCardProps) => {

    // Hàm xử lý thả tim
    const toggleFavorite = async (id: number, e: React.MouseEvent) => {
        e.preventDefault();

        // FIX GẠCH ĐỎ: Kiểm tra xem setPlaces có được truyền vào không
        if (!setPlaces) return;

        const newStatus = !(item.experience?.will_return || false);

        // Update UI nhanh (Optimistic Update)
        // Ép kiểu p: Place để trùng khớp với Interface của bạn
        setPlaces((prev: Place[]) => prev.map(p =>
            p.id === id
                ? {
                    ...p,
                    experience: { ...(p.experience || {}), will_return: newStatus }
                }
                : p
        ));

        try {
            // Dùng axios hoặc fetch đều được, nhưng hãy dùng đúng URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${apiUrl}/api/places/${id}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ will_return: newStatus })
            });

            if (!res.ok) throw new Error('Server error');
        } catch (err) {
            console.error("Lưu DB thất bại:", err);
            // Có thể rollback UI ở đây nếu cần
        }
    };
    const FavoriteButton = () => (
        <button
            onClick={(e) => toggleFavorite(item.id, e)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:scale-110 transition-transform active:scale-95 group/heart"
        >
            <Heart
                size={22}
                className={`transition-colors duration-300 ${item.experience?.will_return
                    ? "text-red-500 fill-red-500"
                    : "text-zinc-400 group-hover/heart:text-red-400"
                    }`}
            />
        </button>
    );

    // --- 1. GIAO DIỆN NHẬT KÝ (Hiện ngày tháng) ---
    if (variant === 'diary') {
        const entryDate = formatDiaryDate(item.created_at);

        return (
            <div className="relative group mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className={`absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_8px_25px_rgba(0,0,0,0.03)] transform transition-transform duration-500 group-hover:rotate-0 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}></div>

                <div className="relative p-6 flex flex-col h-full bg-[#fcfaf8] rounded-[2.5rem] border border-orange-100/50 overflow-hidden">
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-orange-100/60 backdrop-blur-sm border-x border-orange-200/30 z-20 ${index % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}></div>

                    <div className="bg-white p-3 pb-12 rounded-2xl shadow-sm border border-gray-100 relative mb-6">
                        <img
                            src={item.image_url || item.image}
                            alt={item.name}
                            className="w-full h-52 object-cover rounded-lg filter sepia-[0.1]"
                        />
                        <FavoriteButton />

                        {/* HIỆN NGÀY THÁNG TRONG NHẬT KÝ */}
                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full shadow-inner">
                            <CalendarDays size={13} />
                            {entryDate}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col px-1">
                        <h3 className="text-2xl font-bold text-zinc-800 mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-zinc-500 text-sm flex items-start gap-1.5 mb-5 italic">
                            <MapPin size={15} className="text-orange-300 mt-0.5" />
                            <span className="line-clamp-1">{item.address}{item.district && `, ${item.district}`}{item.city && `, ${item.city}`}</span>
                        </p>

                        <div className="relative flex-1 bg-white p-5 rounded-2xl border border-orange-50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)] min-h-[100px]">
                            <p className="font-['Caveat',cursive] text-2xl text-zinc-700 leading-tight pt-1 line-clamp-3">
                                {item.description || item.thoughts || "Hôm nay mình đã có một kỷ niệm thật đẹp tại đây..."}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link
                                href={`/cafe/${item.id}`}
                                className="flex items-center gap-1 text-[11px] font-bold text-orange-700/70 hover:text-orange-800 transition-colors bg-orange-100/50 px-3 py-1 rounded-full border border-orange-200/20 group/link"
                            >
                                <span>Xem chi tiết</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. GIAO DIỆN WISHLIST (KHÔNG CÓ NGÀY THÁNG) ---
    return (
        <div className="group relative bg-white p-4 rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col animate-in fade-in duration-500">
            <div className="h-48 rounded-[2rem] overflow-hidden mb-5 relative">
                <img
                    src={item.image_url || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <FavoriteButton />
            </div>

            <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-lg text-zinc-800 line-clamp-1">{item.name}</h4>
                    <p className="text-zinc-500 text-sm flex items-start gap-1.5 mt-2 italic">
                        <MapPin size={14} className="text-orange-300 mt-0.5" />
                        <span className="line-clamp-2">{item.address}</span>
                    </p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-orange-50">
                    <span className="text-2xl">{item.emoji || "☕"}</span>
                    <Link
                        href={`/cafe/${item.id}`}
                        className="text-orange-600 text-xs font-bold hover:underline flex items-center gap-1 group/link"
                    >
                        Chi tiết
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;
