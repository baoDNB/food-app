import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [isFocused, setIsFocused] = useState(false);

  // Mock dữ liệu gợi ý
  const suggestions = [
    { icon: 'coffee', label: 'Cà phê muối Phố Huế', desc: 'Vibe cổ điển, đậm đà' },
    { icon: 'restaurant', label: 'Bún chả Tuyết', desc: 'Hàng Than • 4.5 sao' },
    { icon: 'local_mall', label: 'Tổ hợp Complex 01', desc: 'Sống ảo cực nghệ' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
      {/* Overlay mờ nền khi đang search */}
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40 transition-opacity duration-500 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}
      />

      <span className="font-journal-accent text-primary mb-2 z-10">Xin chào, Foodie! 👋</span>
      
      <h1 className={`text-4xl md:text-5xl font-bold text-on-background mb-8 max-w-2xl transition-all duration-700 z-10 ${isFocused ? 'scale-95 opacity-50 blur-[2px]' : 'scale-100'}`}>
        Hôm nay bạn muốn đi đâu?
      </h1>

      <div 
        className={`w-full relative z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFocused ? 'max-w-3xl scale-105' : 'max-w-2xl'}`}
      >
        {/* Search Bar chính */}
        <div className="relative group">
          <input
            type="text"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`w-full h-16 pl-14 pr-12 rounded-2xl border-none transition-all duration-300 shadow-xl
              ${isFocused 
                ? 'bg-white ring-2 ring-primary ring-offset-4 ring-offset-background' 
                : 'bg-surface-container-low ring-1 ring-outline-variant hover:ring-primary/50'
              }`}
            placeholder="Tìm kiếm quán ngon, cà phê vibe..."
          />
          <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300
            ${isFocused ? 'text-primary' : 'text-outline'}`}>
            search
          </span>
          
          {isFocused && (
             <button className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
             </button>
          )}
        </div>

        {/* Panel Gợi ý "rơi" xuống */}
        <div 
          className={`absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl border border-white overflow-hidden transition-all duration-500 origin-top
            ${isFocused ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
        >
          <div className="text-left">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-3">Gợi ý nhanh</p>
            <div className="space-y-1">
              {suggestions.map((item, index) => (
                <div 
                  key={index}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-all duration-300 transform
                    ${isFocused ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 text-sm leading-tight">{item.label}</h4>
                    <p className="text-zinc-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;