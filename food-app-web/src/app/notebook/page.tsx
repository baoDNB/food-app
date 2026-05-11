"use client";

import ProfileHeader from "@/components/notebook/ProfileHeader";
import PlaceCard from "@/components/notebook/PlaceCard";
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function NotebookPage() {
    const [activeTab, setActiveTab] = useState<'wishlist' | 'diary'>('wishlist');
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/places')
            .then(res => res.json())
            .then(data => {
                setPlaces(data);
                setLoading(false);
            })
            .catch(err => console.error("Lỗi lấy dữ liệu:", err));
    }, []);

    const stats = {
        visitedCount: places.filter(p => p.experience?.is_visited).length,
        favoriteCount: places.filter(p => p.experience?.will_return).length,
    };

    const filteredPlaces = places.filter(place => {
        const exp = place.experience;
        const hasAnyActivity = !!(exp?.is_visited || exp?.tried_signature || exp?.took_photo || exp?.will_return);
        const isFavorite = !!exp?.will_return;

        if (activeTab === 'diary') return hasAnyActivity;
        return isFavorite;
    });

    return (
        <main className="max-w-7xl mx-auto px-6 pb-20 pt-10">
            <ProfileHeader stats={stats} loading={loading} />

            {/* Tabs Navigation */}
            <div className="flex items-center justify-center gap-12 mb-12 border-b border-zinc-100">
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`pb-4 px-2 font-bold transition-all relative ${
                        activeTab === 'wishlist' 
                        ? "text-orange-600" 
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                >
                    Wishlist
                    {activeTab === 'wishlist' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('diary')}
                    className={`pb-4 px-2 font-bold transition-all relative ${
                        activeTab === 'diary' 
                        ? "text-orange-600" 
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                >
                    Nhật ký của tôi
                    {activeTab === 'diary' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {loading ? (
                    <div className="col-span-12 text-center py-20 text-gray-400 italic font-medium">
                        Đang mở sổ tay...
                    </div>
                ) : (
                    <>
                        {activeTab === 'diary' && (
                            <Link
                                href="/notebook/new"
                                className="md:col-span-6 bg-orange-50/30 border-2 border-dashed border-orange-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:bg-orange-50 transition-all group min-h-[400px] mb-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-orange-600">
                                        add_circle
                                    </span>
                                </div>
                                <span className="font-bold text-orange-800 text-lg">Viết nhật ký mới</span>
                                <span className="text-orange-600/60 text-sm mt-1">Lưu lại kỷ niệm hôm nay</span>
                            </Link>
                        )}

                        {filteredPlaces.map((item, index) => (
                            <div 
                                key={item.id} 
                                className={activeTab === 'diary' ? "md:col-span-6" : "md:col-span-4"}
                            >
                                <PlaceCard 
                                    item={item} 
                                    index={index} 
                                    setPlaces={setPlaces} 
                                />
                            </div>
                        ))}

                        {filteredPlaces.length === 0 && (
                            <div className="col-span-12 text-center py-20">
                                <p className="text-zinc-400 italic">Chưa có quán nào trong danh sách này...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}