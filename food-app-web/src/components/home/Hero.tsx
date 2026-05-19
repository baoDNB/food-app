"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type SearchResult = {
  id: string | number;
  name: string;
  address?: string;
  image_url?: string;
};

const filterResults = (items: SearchResult[], term: string) => {
  const normalized = term.toLowerCase();
  return items
    .filter(item =>
      item.name.toLowerCase().includes(normalized) ||
      item.address?.toLowerCase().includes(normalized) ||
      item.image_url?.toLowerCase().includes(normalized)
    )
    .slice(0, 5);
};

const HISTORY_KEY = 'food-app-search-history';

const Hero = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  const saveHistory = (term: string) => {
    if (!term) return;
    setSearchHistory(prev => {
      const next = [term, ...prev.filter(item => item !== term)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
        setShowPanel(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
        setShowPanel(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm.length <= 1) {
      setResults([]);
      setShowPanel(false);
      return;
    }

    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setShowPanel(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places?search=${encodeURIComponent(trimmedTerm)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Network error');
        }

        const data: SearchResult[] = await response.json();
        setResults(filterResults(data, trimmedTerm));
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return;
        console.error("Lỗi fetch dữ liệu:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchTerm]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      setIsFocused(true);
      setShowPanel(true);
      return;
    }
    saveHistory(term);
    router.push(`/discovery?search=${encodeURIComponent(term)}`);
    setShowPanel(false);
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    saveHistory(term);
    router.push(`/discovery?search=${encodeURIComponent(term)}`);
    setShowPanel(false);
  };

  const handleResultClick = (item: SearchResult) => {
    saveHistory(searchTerm.trim());
    setShowPanel(false);
    router.push(`/cafe/${item.id}`);
  };

  const showHistory = isFocused && !searchTerm.trim().length && searchHistory.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center relative">
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity duration-500 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}
      />

      <span className="font-journal-accent text-primary mb-2 z-10">Xin chào, Foodie! 👋</span>

      <h1 className={`text-4xl md:text-5xl font-bold text-on-background mb-8 max-w-2xl transition-all duration-700 z-10 ${isFocused ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100'}`}>
        Hôm nay bạn muốn đi đâu?
      </h1>

      <div ref={containerRef} className={`w-full relative z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFocused ? 'max-w-3xl scale-105' : 'max-w-2xl'}`}>
        <form onSubmit={handleSearchSubmit} className="relative group" aria-label="Tìm kiếm quán ăn">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowPanel(true); // luôn mở panel khi focus
            }}
            className={`w-full h-16 pl-14 pr-12 rounded-2xl border-none transition-all duration-300 shadow-xl
              ${isFocused
                ? 'bg-white ring-2 ring-primary ring-offset-4 ring-offset-background'
                : 'bg-surface-container-low ring-1 ring-outline-variant hover:ring-primary/50'
              }`}
            placeholder="Tìm kiếm quán ngon, cà phê vibe..."
            aria-label="Tìm kiếm"
          />
          <button
            type="submit"
            className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-outline'}`}
            aria-label="Tìm kiếm"
          >
            search
          </button>

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setResults([]);
                setShowPanel(false);
                inputRef.current?.focus();
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </form>

        <div
          className={`absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl border border-white overflow-hidden transition-all duration-500 origin-top
            ${showPanel && (results.length > 0 || isLoading || searchTerm.trim().length > 1 || showHistory) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
        >
          <div className="text-left">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-3">
              {isLoading
                ? 'Đang tìm kiếm...'
                : showHistory
                  ? 'Lịch sử tìm kiếm'
                  : searchTerm.trim().length > 1
                    ? 'Kết quả phù hợp'
                    : 'Nhập ít nhất 2 ký tự để tìm kiếm'}
            </p>

            <div className="space-y-1">
              {isLoading && (
                <div className="px-3 py-5 text-sm text-zinc-500">Đợi một chút, đang tìm quán phù hợp...</div>
              )}

              {showHistory && (
                <ul className="space-y-2">
                  {searchHistory.map((term, index) => (
                    <li key={`${term}-${index}`} className="flex items-center justify-between gap-3 rounded-xl p-3 hover:bg-primary/5 transition-colors">
                      <button
                        type="button"
                        onClick={() => handleHistoryClick(term)}
                        className="text-left flex-1 truncate font-medium text-zinc-800"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = searchHistory.filter(item => item !== term);
                          setSearchHistory(next);
                          localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
                        }}
                        className="text-zinc-400 hover:text-primary"
                        aria-label={`Xóa lịch sử ${term}`}
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && !showHistory && searchTerm.trim().length > 1 && results.length === 0 && (
                <div className="px-3 py-5 text-sm text-zinc-500">Không tìm thấy kết quả phù hợp.</div>
              )}

              {!isLoading && !showHistory && results.length > 0 && (
                <ul className="space-y-1">
                  {results.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-all duration-300 group"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <img className="text-lg" src={item.image_url} alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-800 text-sm leading-tight truncate">{item.name}</h4>
                        <p className="text-zinc-400 text-xs truncate">{item.address}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;