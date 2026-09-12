"use client";

import React, { useState } from 'react';

// ==========================================
// 1. DATA: DANH MỤC 14 CÔNG CỤ VÔ ĐỐI
// ==========================================
const CATEGORIES = [
  { id: 'all', name: 'Tất cả tiện ích' },
  { id: 'income', name: 'Thu Nhập & Thuế' },
  { id: 'invest', name: 'Ngân Hàng & Đầu Tư' },
  { id: 'build', name: 'Xây Dựng & Phong Thủy' },
  { id: 'life', name: 'Đời Sống & Xe Cộ' }
];

const TOOLS = [
  // --- NHÓM 1: THU NHẬP & THUẾ ---
  {
    id: 'gross-net',
    category: 'income',
    title: "Quy Đổi Gross ➔ Net",
    desc: "Chiết tính tự động dựa trên mức lương cơ sở và biểu thuế lũy tiến. Biết chính xác số tiền thực nhận.",
    link: "/tinh-luong-gross-net",
    icon: "💰",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 'quyet-toan',
    category: 'income',
    title: "Quyết Toán Thuế TNCN",
    desc: "Kiểm tra nhanh số tiền Thuế bạn được Cục Thuế hoàn lại hoặc số tiền truy thu phải nộp thêm.",
    link: "/quyet-toan-thue-tncn",
    icon: "⚖️",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 'bhxh',
    category: 'income',
    title: "Tính Rút BHXH 1 Lần",
    desc: "Tự động áp dụng hệ số trượt giá (lạm phát). Báo cáo chiết tính phân tách chặng đóng trước/sau 2014.",
    link: "/tinh-bhxh-1-lan",
    icon: "🏦",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 'bhtn',
    category: 'income',
    title: "Trợ Cấp Thất Nghiệp",
    desc: "Tính toán mức hưởng BHTN hàng tháng và số tháng được lãnh bảo hiểm theo luật Việc làm mới nhất.",
    link: "/tinh-tro-cap-that-nghiep",
    icon: "🛡️",
    color: "from-rose-500 to-pink-600"
  },

  // --- NHÓM 2: NGÂN HÀNG & ĐẦU TƯ ---
  {
    id: 'lai-vay',
    category: 'invest',
    title: "Lãi Vay Ngân Hàng",
    desc: "So sánh trực quan trả theo dư nợ giảm dần và dư nợ ban đầu. Xuất lịch trả nợ chi tiết hàng tháng.",
    link: "/tinh-lai-vay",
    icon: "📉",
    color: "from-rose-500 to-red-600"
  },
  {
    id: 'lai-kep',
    category: 'invest',
    title: "Lãi Tiết Kiệm (Lãi Kép)",
    desc: "Tận dụng sức mạnh của kỳ quan thứ 8. Lập bảng theo dõi dòng tiền gửi góp định kỳ tối ưu tài sản.",
    link: "/tinh-lai-tiet-kiem",
    icon: "📈",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 'ty-gia',
    category: 'invest',
    title: "Tỷ Giá & Giá Vàng",
    desc: "Công cụ quy đổi ngoại tệ, giá vàng SJC trực tuyến. Cập nhật liên tục nhịp đập thị trường tài chính.",
    link: "/quy-doi-ty-gia-vang",
    icon: "💱",
    color: "from-yellow-400 to-amber-500"
  },

  // --- NHÓM 3: XÂY DỰNG & PHONG THỦY ---
  {
    id: 'xay-nha',
    category: 'build',
    title: "Dự Toán Chi Phí Xây Nhà",
    desc: "Bóc tách khối lượng m2, vật tư nền móng và hạng mục cơ khí, cổng cửa sắt mỹ thuật.",
    link: "/uoc-tinh-chi-phi-xay-nha",
    icon: "🏗️",
    color: "from-sky-500 to-blue-600"
  },
  {
    id: 'lo-ban',
    category: 'build',
    title: "Thước Lỗ Ban Phong Thủy",
    desc: "Tra cứu kích thước đẹp (Thông Thủy, Dương Trạch, Âm Phần) để làm cửa, cổng và nội thất.",
    link: "/thuoc-lo-ban",
    icon: "📏",
    color: "from-red-500 to-rose-600"
  },
  {
    id: 'van-nien',
    category: 'build',
    title: "Lịch Vạn Niên & Ngày Tốt",
    desc: "Tra cứu ngày Âm Dương, Giờ Hoàng Đạo để xem ngày động thổ, nhập trạch đại cát đại lợi.",
    link: "/lich-van-nien",
    icon: "📅",
    color: "from-fuchsia-500 to-purple-600"
  },

  // --- NHÓM 4: ĐỜI SỐNG & XE CỘ ---
  {
    id: 'lan-banh',
    category: 'life',
    title: "Dự Toán Lăn Bánh Ô Tô",
    desc: "Cập nhật lệ phí trước bạ, phí biển số và bảo hiểm mới nhất cho toàn bộ 63 tỉnh thành năm 2026.",
    link: "/du-toan-lan-banh-oto",
    icon: "🚘",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 'nuoi-xe',
    category: 'life',
    title: "Chi Phí Nuôi Xe Ô Tô",
    desc: "Bảng ước tính xăng xe, bãi gửi, phí đường bộ và lịch bảo dưỡng dầu máy (từ Sedan 2.0E đến SUV).",
    link: "/tinh-chi-phi-nuoi-xe",
    icon: "⛽",
    color: "from-slate-600 to-slate-800"
  },
  {
    id: 'tien-dien',
    category: 'life',
    title: "Tính Tiền Điện EVN",
    desc: "Bóc tách 6 bậc thang điện sinh hoạt. Hỗ trợ kiểm soát chi phí điện năng máy lạnh, điện gia dụng.",
    link: "/tinh-tien-dien",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 'bmi',
    category: 'life',
    title: "Chỉ Số Sức Khỏe (BMI & TDEE)",
    desc: "Khám phá tỷ lệ trao đổi chất cơ thể để xây dựng lộ trình ăn uống, tập luyện thể lực tại nhà.",
    link: "/tinh-chi-so-bmi-tdee",
    icon: "💪",
    color: "from-emerald-400 to-green-600"
  }
];

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc công cụ dựa trên cả Category và Search Keyword
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="w-full font-sans selection:bg-blue-300 selection:text-blue-900 bg-slate-50 min-h-screen">
      
      {/* ==========================================
          HERO SECTION (DARK MODE ĐẲNG CẤP)
          ========================================== */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-28 md:pt-28 md:pb-36 rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-20">
        <div className="absolute top-0 left-1/2 w-full max-w-7xl -translate-x-1/2 h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] left-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-blue-600/20 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-emerald-600/20 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md mb-8 shadow-2xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-slate-300">Tích hợp 14 công cụ chuyên gia. Cập nhật 2026.</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.15] text-center max-w-4xl">
            Trung Tâm 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 ml-3">
              Kiểm Soát Dữ Liệu.
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 text-center">
            Từ chiết tính thuế, quy đổi tài chính cho đến dự toán công trình. Hệ thống tự động xử lý hàng tỷ phép tính ngay trên trình duyệt mà không lưu trữ dữ liệu cá nhân của bạn.
          </p>

          {/* SEARCH BAR (WEB APP STYLE) */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg aria-hidden="true" className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              className="w-full p-5 pl-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium text-lg backdrop-blur-md shadow-2xl" 
              placeholder="Bạn muốn tính toán gì hôm nay?..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Phím tắt ảo */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden sm:flex">
              <span className="text-xs font-bold text-slate-400 border border-slate-600 rounded-md px-2 py-1 bg-slate-800">Ctrl + K</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          APP GRID & SMART FILTER
          ========================================== */}
      <section className="py-12 md:py-20 relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* CATEGORY FILTER PILLS */}
          <div className="flex overflow-x-auto custom-scrollbar pb-4 mb-8 md:mb-12 gap-3 md:gap-4 justify-start lg:justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-400' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy công cụ</h3>
              <p className="text-slate-500">Thử tìm kiếm bằng từ khóa khác như "lãi suất", "ô tô", "thuế"...</p>
            </div>
          )}

          {/* GRID RENDER CÁC CÔNG CỤ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTools.map((tool) => (
              <a key={tool.id} href={tool.link} className="group relative block h-full bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-500 overflow-hidden flex flex-col">
                
                {/* Dải gradient ngầm */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    {tool.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed flex-1">
                  {tool.desc}
                </p>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          FOOTER CHUẨN APP (Minimalist)
          ========================================== */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-2xl mb-4 shadow-lg">S</div>
          <h2 className="font-black text-slate-800 text-lg mb-2">HỆ THỐNG SỐ CHUẨN</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md">Bảo mật 100%. Mọi thuật toán được thực thi trực tiếp trên trình duyệt của bạn (Client-side computing).</p>
          <div className="text-xs font-medium text-slate-400">© 2026 SoChuan.vn. All rights reserved.</div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 0px; width: 0px; }
      `}} />
    </main>
  );
}