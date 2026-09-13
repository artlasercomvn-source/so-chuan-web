"use client";

import React, { useState } from 'react';

// ==========================================
// 1. DATA: 16 CÔNG CỤ (SVG ICONS)
// ==========================================
const CATEGORIES = [
  { id: 'all', name: 'Tất cả tiện ích' },
  { id: 'income', name: 'Thu Nhập & Thuế' },
  { id: 'invest', name: 'Ngân Hàng & Đầu Tư' },
  { id: 'build', name: 'Xây Dựng & Phong Thủy' },
  { id: 'life', name: 'Đời Sống & Xe Cộ' }
];

const IconRender = ({ path }: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const TOOLS = [
  // --- HÀNG 1: TRA CỨU HÀNG NGÀY & CÁ NHÂN ---
  {
    id: 'van-nien', category: 'build', title: "Lịch Vạn Niên & Ngày Tốt",
    desc: "Tra cứu ngày Âm Dương, Giờ Hoàng Đạo để xem ngày động thổ, nhập trạch đại cát đại lợi.", link: "/lich-van-nien",
    color: "from-blue-50 to-blue-100", iconColor: "text-blue-600",
    icon: <IconRender path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  },
  {
    id: 'ty-gia', category: 'invest', title: "Tỷ Giá & Giá Vàng",
    desc: "Công cụ quy đổi ngoại tệ, giá vàng SJC trực tuyến. Cập nhật liên tục nhịp đập thị trường.", link: "/quy-doi-ty-gia-vang",
    color: "from-amber-50 to-amber-100", iconColor: "text-amber-600",
    icon: <IconRender path="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  },
  {
    id: 'gross-net', category: 'income', title: "Quy Đổi Gross ➔ Net",
    desc: "Chiết tính tự động dựa trên mức lương cơ sở và biểu thuế. Biết chính xác số tiền thực nhận.", link: "/tinh-luong-gross-net",
    color: "from-emerald-50 to-emerald-100", iconColor: "text-emerald-600",
    icon: <IconRender path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  },
  {
    id: 'bmi', category: 'life', title: "Chỉ Số Sức Khỏe (BMI)",
    desc: "Khám phá tỷ lệ trao đổi chất để xây dựng lộ trình ăn uống, tập luyện thể lực tại nhà.", link: "/tinh-chi-so-bmi-tdee",
    color: "from-rose-50 to-rose-100", iconColor: "text-rose-600",
    icon: <IconRender path="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  },

  // --- HÀNG 2: SỰ KIỆN TÀI CHÍNH LỚN ---
  {
    id: 'quyet-toan', category: 'income', title: "Quyết Toán Thuế TNCN",
    desc: "Kiểm tra nhanh số tiền Thuế bạn được Cục Thuế hoàn lại hoặc số tiền truy thu phải nộp thêm.", link: "/quyet-toan-thue-tncn",
    color: "from-violet-50 to-violet-100", iconColor: "text-violet-600",
    icon: <IconRender path="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  },
  {
    id: 'bhxh', category: 'income', title: "Rút BHXH 1 Lần",
    desc: "Tự động áp dụng hệ số lạm phát. Báo cáo chiết tính phân tách chặng đóng trước/sau 2014.", link: "/tinh-bhxh-1-lan",
    color: "from-orange-50 to-orange-100", iconColor: "text-orange-600",
    icon: <IconRender path="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  },
  {
    id: 'bhtn', category: 'income', title: "Trợ Cấp Thất Nghiệp",
    desc: "Tính toán mức hưởng BHTN hàng tháng và số tháng được lãnh bảo hiểm theo luật Việc làm.", link: "/tinh-tro-cap-that-nghiep",
    color: "from-fuchsia-50 to-fuchsia-100", iconColor: "text-fuchsia-600",
    icon: <IconRender path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  },
  {
    id: 'lai-kep', category: 'invest', title: "Lãi Tiết Kiệm (Lãi Kép)",
    desc: "Tận dụng sức mạnh kỳ quan thứ 8. Lập bảng theo dõi dòng tiền gửi góp định kỳ tối ưu tài sản.", link: "/tinh-lai-tiet-kiem",
    color: "from-teal-50 to-teal-100", iconColor: "text-teal-600",
    icon: <IconRender path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  },

  // --- HÀNG 3: NHÀ Ở & XÂY DỰNG ---
  {
    id: 'lai-vay', category: 'invest', title: "Lãi Vay Ngân Hàng",
    desc: "So sánh trực quan trả theo dư nợ giảm dần và dư nợ ban đầu. Xuất lịch trả nợ chi tiết.", link: "/tinh-lai-vay",
    color: "from-red-50 to-red-100", iconColor: "text-red-600",
    icon: <IconRender path="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  },
  {
    id: 'thue-dat', category: 'build', title: "Lệ Phí & Thuế Nhà Đất",
    desc: "Ước tính lệ phí trước bạ, thuế thu nhập cá nhân khi tiến hành sang tên chuyển nhượng sổ đỏ.", link: "/tinh-thue-nha-dat",
    color: "from-cyan-50 to-cyan-100", iconColor: "text-cyan-600",
    icon: <IconRender path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  },
  {
    id: 'xay-nha', category: 'build', title: "Chi Phí Xây Nhà Trọn Gói",
    desc: "Bóc tách khối lượng m2, vật tư nền móng và hạng mục cơ khí, cổng cửa sắt mỹ thuật.", link: "/uoc-tinh-chi-phi-xay-nha",
    color: "from-sky-50 to-sky-100", iconColor: "text-sky-600",
    icon: <IconRender path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  },
  {
    id: 'lo-ban', category: 'build', title: "Thước Lỗ Ban Phong Thủy",
    desc: "Tra cứu kích thước đẹp (Thông Thủy, Dương Trạch, Âm Phần) để làm cửa, cổng và nội thất.", link: "/thuoc-lo-ban",
    color: "from-indigo-50 to-indigo-100", iconColor: "text-indigo-600",
    icon: <IconRender path="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
  },

  // --- HÀNG 4: ĐỜI SỐNG, THIẾT BỊ & XE CỘ ---
  {
    id: 'lan-banh', category: 'life', title: "Dự Toán Lăn Bánh Ô Tô",
    desc: "Cập nhật lệ phí trước bạ, phí biển số và bảo hiểm mới nhất cho toàn bộ 63 tỉnh thành.", link: "/du-toan-lan-banh-oto",
    color: "from-slate-100 to-slate-200", iconColor: "text-slate-700",
    icon: <IconRender path="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  },
  {
    id: 'nuoi-xe', category: 'life', title: "Chi Phí Nuôi Xe Ô Tô",
    desc: "Bảng ước tính xăng xe, bãi gửi, phí đường bộ và lịch bảo dưỡng thay nhớt động cơ.", link: "/tinh-chi-phi-nuoi-xe",
    color: "from-gray-100 to-gray-200", iconColor: "text-gray-800",
    icon: <IconRender path="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.014a4.514 4.514 0 00-1.597-4.436 4.453 4.453 0 00-4.808-.491c-.424.238-.854.545-1.25.928M15.1 8.94c-1.396-1.397-3.415-1.89-5.17-1.218" />
  },
  {
    id: 'tien-dien', category: 'life', title: "Tính Tiền Điện EVN",
    desc: "Bóc tách 6 bậc thang. Hỗ trợ kiểm soát chi phí điện năng, thiết bị điện máy gia dụng.", link: "/tinh-tien-dien",
    color: "from-yellow-100 to-amber-200", iconColor: "text-yellow-600",
    icon: <IconRender path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  },
  {
    id: 'dieu-hoa', category: 'life', title: "Công Suất Điều Hòa (BTU)",
    desc: "Tính toán chính xác công suất máy lạnh (9000 - 24000 BTU) dựa trên diện tích và cách nhiệt.", link: "/tinh-cong-suat-dieu-hoa",
    color: "from-cyan-100 to-blue-200", iconColor: "text-cyan-700",
    icon: <IconRender path="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="w-full relative overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-[0.15] blur-[100px]"></div>
        <div className="absolute left-60 right-0 top-20 -z-10 m-auto h-[250px] w-[250px] rounded-full bg-emerald-400 opacity-[0.1] blur-[100px]"></div>
      </div>

      {/* ==========================================
          HERO SECTION 
          ========================================== */}
      <section className="relative z-10 pt-16 pb-16 md:pt-24 md:pb-24 flex flex-col items-center px-4 md:px-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-8 hover:shadow-md transition-shadow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-xs md:text-sm font-semibold text-slate-600">✨ Cập nhật Thuật toán Pháp luật & Thuế 2026</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 tracking-tight mb-6 text-center max-w-4xl leading-[1.15]">
          Giải Quyết Mọi Bài Toán <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
            Tài Chính & Đời Sống
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 text-center font-medium">
          Nền tảng tiện ích siêu cấp. Tự động xử lý hàng tỷ phép tính ngay trên trình duyệt, không yêu cầu đăng nhập, bảo mật tuyệt đối dữ liệu của bạn.
        </p>

        {/* SEARCH BAR SPOTLIGHT */}
        <div className="w-full max-w-2xl relative group z-20">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <IconRender path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </div>
          <input 
            type="text" 
            className="w-full py-4 pl-14 pr-16 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]" 
            placeholder="Tìm kiếm công cụ: Lãi vay, Lỗ ban, Ô tô..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden sm:flex">
            <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">Tìm kiếm</div>
          </div>
        </div>
      </section>

      {/* ==========================================
          APP GRID & SMART FILTER
          ========================================== */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex overflow-x-auto custom-scrollbar pb-4 mb-10 gap-3 md:gap-4 justify-start lg:justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/80 shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed">
              <div className="text-5xl mb-4 opacity-50">🔍</div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy công cụ</h3>
              <p className="text-slate-500 text-sm">Hãy thử tìm kiếm với từ khóa khác.</p>
            </div>
          )}

          {/* MẪU GRID 4 CỘT HOÀN HẢO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <a 
                key={tool.id} 
                href={tool.link} 
                className="group flex flex-col bg-white/80 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-slate-100 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-300 ${tool.iconColor}`}>
                    {tool.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                    <IconRender path="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors relative z-10 leading-snug">
                  {tool.title}
                </h3>
                
                <p className="text-slate-500 text-[13px] leading-relaxed flex-1 font-medium relative z-10">
                  {tool.desc}
                </p>
              </a>
            ))}
          </div>

        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 0px; width: 0px; }
      `}} />
    </main>
  );
}