import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Số Chuẩn | Giải Quyết Mọi Bài Toán Tài Chính & Đời Sống",
  description: "Hệ sinh thái tiện ích siêu cấp. Xử lý hàng tỷ phép tính ngay trên trình duyệt, bảo mật tuyệt đối 100% dữ liệu cá nhân của bạn.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
        
        {/* HEADER TỐI GIẢN (Chỉ Logo - Dồn focus vào nội dung) */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:scale-105 transition-transform shadow-sm">S</div>
              <span className="font-black text-slate-900 text-[1.1rem] tracking-tight group-hover:text-blue-600 transition-colors">SỐ CHUẨN</span>
            </a>
            {/* Xóa sạch Nút Đăng Nhập & Menu thừa để tối ưu Traffic */}
          </div>
        </header>

        {/* NỘI DUNG CÁC TRANG */}
        {children}

        {/* FOOTER ĐƠN GIẢN (Chuẩn App Quốc tế) */}
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-lg tracking-tight">SỐ CHUẨN</span>
              <span className="text-sm font-medium">© 2026. All rights reserved.</span>
            </div>
            <div className="text-xs font-medium opacity-60">Nền tảng chiết tính tự động số 1 Việt Nam.</div>
          </div>
        </footer>

      </body>
    </html>
  );
}