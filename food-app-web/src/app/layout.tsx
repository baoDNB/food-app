import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"; // Import Header của bạn
import Link from "next/dist/client/link";
import Newsletter from "@/components/home/Newsletter";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "900"], // Thêm weight 900 cho các tiêu đề mạnh mẽ
});

export const metadata: Metadata = {
  title: "Hôm nay ăn gì | Hanoi Youth Journal",
  description: "Nhật ký khám phá ẩm thực Hà Nội dành cho giới trẻ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet" />
      </head>

      <body className={`${beVietnamPro.className} antialiased bg-background text-on-background journal-texture min-h-screen relative`}>
        <Header />
        <div className="pt-20">
          {children}
         

        </div>
        

        <Link
          href="/notebook/new"
          className="fixed bottom-8 right-8 bg-[#FF6B35] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50 hover:bg-[#ab3500] hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined">book</span>
          <span className="font-bold">Ghi nhật ký</span>
        </Link>

        <footer className="py-7 border-t border-dashed border-outline-variant text-center bg-white/80 backdrop-blur-sm">
          <p className="text-sm text-outline font-bold uppercase tracking-tighter">
            © 2024 Hôm nay ăn gì - A Hanoi Youth Journal
          </p>
        </footer>
      </body>
    </html>
  );
}