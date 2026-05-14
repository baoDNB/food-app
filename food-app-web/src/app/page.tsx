"use client";

import { useState } from "react";
import Hero from "@/components/home/Hero";
import MoodSelector from "@/components/home/MoodSelector";
import HotPlaces from "@/components/home/HotPlaces";
import RandomPickerPage from "@/components/notebook/random";
import QuickNotesPage from "@/components/notebook/note";
import Link from "next/link";
import Newsletter from "@/components/home/Newsletter";

type Mood = {
  label: string;
  query: string;
};

type Place = {
  id: string | number;
  name: string;
  address: string;
  image_url?: string | null;
  vibe_sound: number;
};

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState<Place[] | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const handleMoodSelect = async (mood: Mood) => {

    setStartIndex(0);
    setSelectedMood(mood.label);
    setIsScanning(true);

    setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places?vibe=${encodeURIComponent(mood.query)}`
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data: Place[] = await response.json();
        setAiResult(data);
      } catch (error) {
        console.error("Lỗi fetch:", error);
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <main>
      <Hero />

      {!aiResult && !isScanning && (
        <MoodSelector onMoodSelect={handleMoodSelect} />
      )}

      {isScanning && (
        <div className="py-20 text-center animate-pulse">
          <p className="text-xl font-bold text-[#ab3500]">
            AI đang tìm quán phù hợp với mood "{selectedMood}"...
          </p>
        </div>
      )}

      {aiResult && (
        <section className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 bg-orange-50 text-[#ab3500] rounded-full text-xs font-black uppercase tracking-widest mb-4">
              AI Intelligence Match
            </div>
            <h2 className="text-3xl font-black text-gray-900">
              3 đề xuất "chân ái" cho bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aiResult.slice(startIndex, startIndex + 3).map((place, index) => (
              <div
                key={place.id}
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={place.image_url || "/placeholder-cafe.jpg"}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
                    #{index + 1} BEST MATCH
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black mb-2 group-hover:text-[#ab3500] transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1 italic">
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                      location_on
                    </span>
                    {place.address}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                      <span>Vibe Sound</span>
                      <span>{place.vibe_sound}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400"
                        style={{ width: `${place.vibe_sound}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/cafe/${place.id}`}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#ab3500] transition-all flex items-center justify-center gap-2 group"
                  >
                    Xem chi tiết
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {aiResult.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => {

                  const shuffled = [...aiResult].sort(() => Math.random() - 0.5);
                  setAiResult(shuffled);

                }}
                className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:border-[#ab3500] hover:text-[#ab3500] transition-all"
              >
                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">
                  shuffle
                </span>
                Đổi 3 gợi ý khác ngẫu nhiên
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => setAiResult(null)}
              className="text-sm font-bold text-gray-400 hover:text-gray-900 underline"
            >
              Thử quét lại tâm trạng khác
            </button>
          </div>
        </section>
      )}

      <div className="border-t border-dashed border-zinc-100 w-full" />

      <RandomPickerPage />
      <div className="border-t border-dashed border-zinc-100 w-full" />
      <HotPlaces />
      <div className="border-t border-dashed border-zinc-100 w-full" />
      <QuickNotesPage />
      <Newsletter />
    </main>
  );
}
