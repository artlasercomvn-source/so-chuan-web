import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Số Chuẩn | Hệ Sinh Thái Công Cụ Tài Chính Đỉnh Cao",
  description: "Trải nghiệm các công cụ chiết tính tài chính số 1 Việt Nam. Quy đổi Gross-Net, Lãi Vay, Lãi Kép, Quyết Toán Thuế chính xác, bảo mật và tốc độ chớp nhoáng.",
};

export default function HomePage() {
  const tools = [
    {
      title: "Quy Đổi Gross ➔ Net",
      desc: "Chiết tính tự động dựa trên mức lương cơ sở và biểu thuế lũy tiến 2026. Biết chính xác số tiền thực nhận.",
      link: "/tinh-luong-gross-net",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textLight: "text-blue-600"
    },
    {
      title: "Tính Lãi Vay Ngân Hàng",
      desc: "So sánh trực quan trả theo dư nợ giảm dần và dư nợ ban đầu. Xuất lịch trả nợ chi tiết hàng tháng.",
      link: "/tinh-lai-vay",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      color: "from-rose-500 to-red-600",
      bgLight: "bg-rose-50",
      textLight: "text-rose-600"
    },
    {
      title: "Tính Lãi Tiết Kiệm (Lãi Kép)",
      desc: "Tận dụng sức mạnh của kỳ quan thứ 8. Lập bảng theo dõi dòng tiền gửi góp định kỳ tối ưu tài sản.",
      link: "/tinh-lai-tiet-kiem",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textLight: "text-emerald-600"
    },
    {
      title: "Tính Rút BHXH 1 Lần",
      desc: "Tự động áp dụng hệ số trượt giá (lạm phát). Báo cáo chiết tính phân tách chặng trước/sau 2014.",
      link: "/tinh-bhxh-1-lan",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textLight: "text-amber-600"
    },
    {
      title: "Quyết Toán Thuế TNCN",
      desc: "Kiểm tra nhanh số tiền Thuế bạn được Cục Thuế hoàn lại hoặc số tiền phải nộp thêm trong năm.",
      link: "/quyet-toan-thue-tncn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      color: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50",
      textLight: "text-violet-600"
    },
    {
      title: "Dự Toán Lăn Bánh Ô Tô",
      desc: "Cập nhật lệ phí trước bạ, phí biển số và bảo hiểm mới nhất cho toàn bộ 63 tỉnh thành năm 2026.",
      link: "/du-toan-lan-banh-oto",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      color: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-50",
      textLight: "text-cyan-600"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Số Chuẩn",
    "url": "https://sochuan.vn",
    "description": "Nền tảng công cụ tính toán tài chính số 1 Việt Nam",
    "publisher": {
      "@type": "Organization",
      "name": "Số Chuẩn"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="w-full font-sans selection:bg-blue-300 selection:text-blue-900">
        
        {/* ==========================================
            HERO SECTION (DARK MODE ĐẲNG CẤP)
            ========================================== */}
        <section className="relative overflow-hidden bg-slate-950 pt-24 pb-32 md:pt-32 md:pb-40">
          
          {/* Hiệu ứng ánh sáng nền (Glow Effects) */}
          <div className="absolute top-0 left-1/2 w-full max-w-7xl -translate-x-1/2 h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] left-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-blue-600/20 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-emerald-600/20 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
            <div className="absolute -bottom-[20%] left-[40%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-indigo-600/20 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 shadow-2xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-300">Cập nhật thuật toán Thuế & Luật mới nhất 2026</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.15] max-w-5xl">
              Hệ Sinh Thái <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Công Cụ Tài Chính Đỉnh Cao.
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12">
              Không cần bảng tính phức tạp. Xử lý hàng tỷ phép tính lãi vay, thuế thu nhập và bảo hiểm chỉ trong <strong className="text-slate-200">0.1 giây</strong> ngay trên trình duyệt của bạn.
            </p>

            <a href="#tools" className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1">
              Khám phá hệ thống
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>

        {/* ==========================================
            TOOLS GRID (BENTO BOX STYLE)
            ========================================== */}
        <section id="tools" className="py-20 md:py-32 bg-slate-50 relative -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Lựa chọn công cụ</h2>
              <p className="text-slate-500 font-medium">Bấm vào tiện ích để bắt đầu tính toán ngay lập tức.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tools.map((tool, index) => (
                <a key={index} href={tool.link} className="group relative block h-full bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`}></div>
                  
                  {/* Icon Box */}
                  <div className={`w-16 h-16 rounded-2xl ${tool.bgLight} ${tool.textLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {tool.desc}
                  </p>

                  <div className="mt-8 flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    Mở công cụ 
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================
            FEATURES (SỰ KHÁC BIỆT)
            ========================================== */}
        <section className="py-20 md:py-32 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              
              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white mb-6 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Tốc Độ Phản Hồi 0s</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Kiến trúc điện toán biên (Edge Computing). Xử lý hàng tỷ phép tính ngay trên trình duyệt mà không có độ trễ.</p>
              </div>

              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-emerald-400 mb-6 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Bảo Mật Tuyệt Đối</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Số liệu thu nhập và khoản vay của bạn không bao giờ được gửi về máy chủ. Mọi thứ chỉ tồn tại trên thiết bị cá nhân của bạn.</p>
              </div>

              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-blue-400 mb-6 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Xuất Bản Chuyên Nghiệp</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Hỗ trợ kết xuất đồ thị và lịch trả nợ ra định dạng PDF chuẩn báo cáo để gửi cho đối tác hoặc ngân hàng.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
            SEO CONTENT (TEXT BOTTOM)
            ========================================== */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Trợ lý tài chính cá nhân của thời đại số</h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
              Trong kỷ nguyên số, việc quản trị dòng tiền cá nhân đòi hỏi độ chính xác tuyệt đối. Hệ sinh thái <strong>Số Chuẩn</strong> được phát triển nhằm cung cấp bộ công cụ tính toán tài chính chuyên sâu, loại bỏ hoàn toàn sai số của các phương pháp thủ công bằng Excel.
            </p>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Từ việc lập bảng chiết tính lãi vay mua nhà hàng tháng theo dư nợ giảm dần, cho đến ước tính số tiền quyết toán thuế thu nhập cá nhân dịp đầu năm; mọi thuật toán đều được lập trình bám sát các thông tư, nghị định mới nhất của cơ quan quản lý Nhà nước. Giao diện tối giản, phi tập trung, không lưu trữ dữ liệu giúp bảo vệ sự riêng tư tài chính của bạn một cách tối đa.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}