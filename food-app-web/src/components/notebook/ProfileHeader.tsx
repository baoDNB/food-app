import StatCard from "./StatCard";

interface ProfileHeaderProps {
  stats: {
    visitedCount: number;
    favoriteCount: number;
  };
  loading: boolean;
}
// Nhận stats từ trang chính truyền xuống
export const ProfileHeader = ({ stats, loading }: ProfileHeaderProps) => (
  <section className="relative bg-surface-container-low rounded-[32px] p-8 md:p-12 mb-12 border border-outline-variant/30 overflow-hidden">
    {/* Stickers trang trí */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center rounded-full rotate-12 font-journal-accent text-4xl opacity-80 select-none">✨</div>
    <div className="absolute top-10 left-10 w-16 h-16 bg-primary-fixed text-on-primary-fixed flex items-center justify-center rounded-xl -rotate-12 font-journal-accent text-3xl opacity-60 select-none">🍜</div>

    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
          <img src="anh.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-on-background mb-2">Bao’s Journal</h1>
        <p className="text-on-surface-variant mb-6 italic">"Hanoi foodie looking for the soul in every bowl of Phở. ☕️✨"</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {/* QUÁN ĐÃ ĐI: Lấy từ database */}
          <StatCard 
            count={loading ? "..." : stats.visitedCount} 
            label="Quán đã đi" 
            colorClass="text-primary" 
          />
          
          {/* MÓN ĐÃ THỬ: Bạn có thể giữ số tĩnh hoặc tính tương tự */}
          <StatCard count={0} label="Món đã thử" colorClass="text-tertiary" />
          
          {/* QUÁN YÊU THÍCH: Lấy từ database */}
          <StatCard 
            count={loading ? "..." : stats.favoriteCount} 
            label="Quán yêu thích" 
            colorClass="text-[#FF6B35]" 
          />
        </div>
      </div>
    </div>
  </section>
);

export default ProfileHeader;