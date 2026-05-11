'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 w-full z-50 border-b border-orange-100 bg-[#FFFBF5]/90 backdrop-blur-md">
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#FF6B35] hover:bg-orange-50 rounded-full transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-[#FF6B35] hover:bg-orange-50 rounded-full transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary-container">
            <img src="anh.jpg" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;