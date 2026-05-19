'use client';

import React, { useState, useEffect } from 'react'; // Thêm useState, useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch thông báo từ API Laravel của bạn
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
        // Giữ lại fallback dữ liệu giả nếu muốn
      }
    };

    // Gọi lần đầu khi mount component
    fetchNotifications();

    // LẮNG NGHE TÍN HIỆU TỪ CÁC TRANG KHÁC
    const handleRefresh = () => {
      console.log("Đã nhận tín hiệu làm mới thông báo...");
      fetchNotifications();
    };

    window.addEventListener("refresh_notifications", handleRefresh);

    // Dọn dẹp listener khi unmount
    return () => {
      window.removeEventListener("refresh_notifications", handleRefresh);
    };
  }, []);
  return (
    <header className="fixed top-0 w-full z-[100] border-b border-orange-100 bg-[#FFFBF5]/90 backdrop-blur-md overflow-visible">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-[#FF6B35] italic tracking-tighter">
            Hôm nay ăn gì
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${pathname === '/' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] pb-1' : 'text-zinc-600 hover:text-[#FF6B35]'
                }`}
            >
              Discovery
            </Link>
            <Link
              href="/notebook"
              className={`text-sm font-semibold transition-colors ${pathname === '/notebook' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] pb-1' : 'text-zinc-600 hover:text-[#FF6B35]'
                }`} 
            >
              My Notebook
            </Link>
            <Link href="#" className="text-sm font-semibold text-zinc-600 hover:text-[#FF6B35] transition-colors">Checklist</Link>
            <Link href="#" className="text-sm font-semibold text-zinc-600 hover:text-[#FF6B35] transition-colors">Trending</Link>
          </div>        </div>

        <div className="flex items-center gap-4 relative"> {/* Thêm relative ở đây */}

          {/* Nút Chuông Thông Báo */}
          <div className="relative">
            <button
              onClick={() => setShowNoti(!showNoti)}
              className={`p-2 rounded-full transition-all active:scale-90 ${showNoti ? 'bg-orange-100 text-[#FF6B35]' : 'text-[#FF6B35] hover:bg-orange-50'}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {/* Chấm đỏ báo hiệu có thông báo chưa đọc */}
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {/* Panel Thông báo thả xuống */}
            {showNoti && (
              <>
                {/* Lớp phủ để click ra ngoài thì đóng */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNoti(false)}></div>

                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-orange-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-4 border-b border-orange-50 flex justify-between items-center">
                    <h3 className="font-bold text-zinc-800">Thông báo</h3>
                    <button className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Đánh dấu đã đọc</button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((noti) => (
                        <div
                          key={noti.id}
                          className={`p-4 border-b border-orange-50 hover:bg-orange-50/50 cursor-pointer transition-colors ${!noti.isRead ? 'bg-orange-50/20' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!noti.isRead ? 'bg-[#FF6B35]' : 'bg-transparent'}`}></div>
                            <div>
                              <p className="text-sm font-bold text-zinc-800 leading-tight">{noti.title}</p>
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{noti.message}</p>
                              <p className="text-[10px] text-zinc-400 mt-2">{noti.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-zinc-400">Chưa có thông báo nào mới...</p>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/notifications"
                    className="block p-3 text-center text-xs font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
                    onClick={() => setShowNoti(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>
              </>
            )}
          </div>

          <button className="p-2 text-[#FF6B35] hover:bg-orange-50 rounded-full transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          {/* <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary-container">
            <img src="anh.jpg" alt="Avatar" className="w-full h-full object-cover" />
          </div> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;