"use client";

import { useState, useEffect } from 'react';
import { Shuffle, Utensils, MapPin, RefreshCw } from "lucide-react";
import Link from 'next/link';

export default function RandomPickerPage() {
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/places')
            .then(res => res.json())
            .then(data => setPlaces(data))
            .catch(err => console.error(err));
    }, []);

    const pickRandom = () => {
        if (places.length === 0) return;
        setIsSpinning(true);
        setSelectedPlace(null);

        // Giả lập hiệu ứng quay trong 1.5 giây
        setTimeout(() => {
            const random = places[Math.floor(Math.random() * places.length)];
            setSelectedPlace(random);
            setIsSpinning(false);
        }, 1500);
    };

    return (
        <main className="max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center">
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-orange-100 rounded-full text-orange-600 mb-4">
                    <Shuffle size={32} />
                </div>
                <h1 className="text-3xl font-black text-zinc-800">Hôm nay ăn gì?</h1>
                <p className="text-zinc-800 italic">Để số phận quyết định bữa ăn của bạn</p>
            </div>

            <div className="w-full bg-white rounded-[3rem] p-8 shadow-xl border border-orange-100 relative overflow-hidden text-center">
                {isSpinning ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <RefreshCw size={48} className="text-orange-400 animate-spin" />
                        <p className="font-['Caveat',cursive] text-2xl text-orange-600">Đang chọn quán ngon...</p>
                    </div>
                ) : selectedPlace ? (
                    <div className="animate-in zoom-in duration-500">
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <img 
                                src={selectedPlace.image_url || selectedPlace.image}
                                className="w-full h-full object-cover rounded-[2rem] rotate-3 shadow-lg"
                            />
                            <span className="absolute -top-4 -right-4 text-4xl bg-white p-2 rounded-full shadow-md">✨</span>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-800 mb-2">{selectedPlace.name}</h2>
                        <p className="text-zinc-500 flex items-center justify-center gap-1 mb-6">
                            <MapPin size={16} /> {selectedPlace.address}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={pickRandom} className="px-6 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-2xl hover:bg-zinc-200 transition-colors">
                                Thử lại
                            </button>
                            <Link href={`/cafe/${selectedPlace.id}`} className="px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors">
                                Chốt quán này!
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="py-20">
                        <p className="text-zinc-400 italic mb-8">Sẵn sàng chưa? Nhấn nút bên dưới để quay</p>
                        <button 
                            onClick={pickRandom}
                            className="group relative px-12 py-4 bg-orange-600 text-white font-black text-xl rounded-full shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            XOAY NGAY
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}