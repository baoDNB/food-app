import React from 'react';

type Mood = {
  emoji: string;
  label: string;
  sub: string;
  color: string;
  text: string;
  border: string;
  query: string;
};

type MoodSelectorProps = {
  onMoodSelect: (mood: Mood) => void;
};

const moods: Mood[] = [
  { 
    emoji: "🧡", 
    label: "Rủ thêm bạn bè", 
    sub: "Trending & Fun", 
    color: "bg-orange-100", 
    text: "text-orange-900", 
    border: "hover:border-orange-400",
    query: "group" 
  },
  { 
    emoji: "🌿", 
    label: "Muốn đi một mình", 
    sub: "Healing Time", 
    color: "bg-green-100", 
    text: "text-green-900", 
    border: "hover:border-green-400",
    query: "solo" 
  },
  { 
    emoji: "❄️", 
    label: "Cần chỗ yên tĩnh", 
    sub: "Deep Work", 
    color: "bg-blue-100", 
    text: "text-blue-900", 
    border: "hover:border-blue-400",
    query: "quiet" 
  },
  { 
    emoji: "👾", 
    label: "Đi trốn deadline", 
    sub: "Focused Vibe", 
    color: "bg-purple-100", 
    text: "text-purple-900", 
    border: "hover:border-purple-400",
    query: "deadline" 
  },
];

const MoodSelector = ({ onMoodSelect }: MoodSelectorProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#ab3500] rounded-lg text-white">
          <span className="material-icons-outlined text-xl">AI MOOD</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">AI Mood Experience</h2>
          <p className="text-sm text-gray-800 italic font-medium">Chọn một tâm trạng để AI quét tọa độ phù hợp</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {moods.map((mood) => (
          <button 
            key={mood.query}
            onClick={() => onMoodSelect(mood)}
            className={`
              group relative flex flex-col items-center p-8 
              ${mood.color} rounded-[32px] border-2 border-transparent 
              ${mood.border} transition-all duration-300 text-center
              hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2
              active:scale-95
            `}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-orange-400">✦</span>
            </div>

            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500 ease-out">
              {mood.emoji}
            </div>
            
            <span className={`font-black text-lg ${mood.text} tracking-tight`}>
              {mood.label}
            </span>
            
            <span className="text-[10px] font-black uppercase mt-2 opacity-50 tracking-[0.2em]">
              {mood.sub}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MoodSelector;
