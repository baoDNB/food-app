'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Thêm import ChevronDown cho nút Xem thêm
import { Plus, Sparkles, BookOpen, ChevronDown } from "lucide-react";
import { PlaceCard } from '../notebook/PlaceCard';
import { motion, AnimatePresence } from 'framer-motion';

// Interface rõ ràng cho dữ liệu quán ăn
interface Place {
  id: number;
  name: string;
  address: string;
  category: string;
  tag: string;
  image: string;
}

const categories = [
  { label: "Tất cả", icon: "✨" },
  { label: "Chill một mình", icon: "🍃" },
  { label: "Học bài", icon: "📚" },
  { label: "Tụ tập bạn bè", icon: "🍻" },
  { label: "Hẹn hò", icon: "❤️" },
  { label: "Sống ảo", icon: "📸" },
];

const PlaceSkeleton = () => (
  <div className="bg-white p-4 rounded-[2.5rem] border border-orange-50 shadow-sm animate-pulse">
    <div className="h-52 bg-zinc-100 rounded-[2rem] mb-4"></div>
    <div className="space-y-3 px-2">
      <div className="h-6 bg-zinc-100 rounded-lg w-3/4"></div>
      <div className="h-4 bg-zinc-100 rounded-lg w-1/2"></div>
    </div>
  </div>
);

export default function HotPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  // 1. Thêm State quản lý số lượng hiển thị (Mặc định hiện 6 quán)
  const ITEMS_PER_PAGE = 6;
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const loadData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/places`);
      setPlaces(response.data);
    } catch (error) {
      console.error("Lỗi khi kết nối Backend:", error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Lọc danh sách quán theo Category
  const filteredPlaces = activeCategory === "Tất cả"
    ? places
    : places.filter(place => {
      try {
        // Nếu category được lưu dạng JSON string '["Hẹn hò", "Sống ảo"]'
        const cats = JSON.parse(place.category);
        return Array.isArray(cats) ? cats.includes(activeCategory) : place.category === activeCategory;
      } catch (e) {
        // Nếu category chỉ là chuỗi thường "Hẹn hò"
        return place.category === activeCategory;
      }
    });
  // 3. Cắt mảng để chỉ lấy đúng số lượng cần hiển thị
  const visiblePlaces = filteredPlaces.slice(0, displayCount);

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">

      {/* FILTER BAR */}
      <div className="sticky top-[80px] z-40  py-6 mb-8 -mx-6 px-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveCategory(cat.label);
                // Reset lại số lượng hiển thị khi người dùng đổi tab
                setDisplayCount(ITEMS_PER_PAGE);
              }}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${activeCategory === cat.label
                ? "bg-zinc-800 text-white border-zinc-800 scale-105"
                : "bg-white text-zinc-500 border-zinc-100 hover:border-orange-200"
                }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="min-h-[450px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map((n) => <PlaceSkeleton key={n} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {filteredPlaces.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {/* Render từ mảng đã cắt: visiblePlaces */}
                    {visiblePlaces.map((place) => (
                      <div key={place.id} className="h-full">
                        <PlaceCard item={place} />
                      </div>
                    ))}
                  </div>

                  {/* 4. NÚT XEM THÊM - Chỉ hiện khi vẫn còn quán để xem */}
                  {filteredPlaces.length > displayCount && (
                    <div className="flex justify-center mt-8 mb-16">
                      <button
                        onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                        className="px-8 py-3 rounded-full border-2 border-dashed border-orange-200 text-orange-500 font-bold bg-white/50 hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                      >
                        Lật thêm trang nhật ký
                        <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* EMPTY STATE - Giữ nguyên */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-24 flex flex-col items-center justify-center bg-white/40 rounded-[3.5rem] border-2 border-dashed border-orange-100/40 backdrop-blur-sm"
                >
                  <div className="relative mb-6 text-orange-200">
                    <BookOpen size={64} strokeWidth={1.5} />
                    <Sparkles size={24} className="absolute -top-2 -right-2 text-orange-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-700">Chưa có "kỷ niệm" ở đây...</h3>
                  <p className="text-zinc-400 italic mt-2 text-center max-w-xs">
                    Trang sổ tay cho <span className="text-orange-500 font-semibold">"{activeCategory}"</span> vẫn đang đợi bạn viết tiếp.
                  </p>
                  <button className="mt-8 bg-zinc-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 hover:shadow-orange-200 transition-all flex items-center gap-2 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Thêm quán ngay
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}