import type { Metadata } from "next";
import "./globals.css";

// Khai báo siêu dữ liệu SEO (Bao gồm ép Google nhận diện Favicon ngay lập tức)
export const metadata: Metadata = {
  title: "Số Chuẩn | Hệ Thống Công Cụ Tính Toán Tài Chính Chuẩn Xác",
  description: "Chuyên Gia Tài Chính. Hệ sinh thái tiện ích tài chính dẫn đầu thị trường. Xử lý thuật toán phức tạp ngay trên trình duyệt, bảo mật tuyệt đối.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-200">
        
        {/* ==========================================
            GLOBAL HEADER (Thanh điều hướng dính)
            ========================================== */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 print:hidden transition-all">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
            
            {/* LOGO (Đã bọc thẻ a để click về trang chủ) */}
            <a href="/" className="flex items-center gap-3 group cursor-pointer outline-none">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl md:text-2xl group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg md:text-xl tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                  SỐ CHUẨN
                </span>
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                  Công Cụ Tài Chính
                </span>
              </div>
            </a>

            {/* DANH SÁCH MENU NHANH (Hiển thị trên Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="/tinh-luong-gross-net" className="hover:text-blue-600 transition-colors">Gross ➔ Net</a>
              <a href="/tinh-lai-vay" className="hover:text-blue-600 transition-colors">Tính Lãi Vay</a>
              <a href="/tinh-lai-tiet-kiem" className="hover:text-blue-600 transition-colors">Lãi Tiết Kiệm</a>
              <a href="/tinh-bhxh-1-lan" className="hover:text-blue-600 transition-colors">Rút BHXH</a>
            </nav>

            {/* NÚT MENU MOBILE (Chỉ hiển thị trên điện thoại) */}
            <button className="lg:hidden p-2 text-slate-600 hover:text-blue-600 bg-slate-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            
          </div>
        </header>

        {/* ==========================================
            KHU VỰC HIỂN THỊ CÁC CÔNG CỤ (Dynamic Content)
            ========================================== */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* ==========================================
            GLOBAL FOOTER (Chân trang)
            ========================================== */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 md:py-12 print:hidden mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p className="font-black text-white text-lg mb-1 tracking-tight">HỆ THỐNG SỐ CHUẨN</p>
              <p className="text-xs md:text-sm">Nền tảng chiết tính tài chính tự động số 1 Việt Nam.</p>
            </div>
            <div className="text-xs font-medium bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              © 2026 SoChuan.vn. All rights reserved.
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}