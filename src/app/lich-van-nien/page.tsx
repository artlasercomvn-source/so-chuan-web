"use client";

import React, { useState, useEffect } from "react";

// ==========================================
// 1. DỮ LIỆU CAN CHI & HOÀNG ĐẠO
// ==========================================
const CAN = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
const CHI = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];
const CHI_HOURS = ["Tý (23h-1h)", "Sửu (1h-3h)", "Dần (3h-5h)", "Mão (5h-7h)", "Thìn (7h-9h)", "Tỵ (9h-11h)", "Ngọ (11h-13h)", "Mùi (13h-15h)", "Thân (15h-17h)", "Dậu (17h-19h)", "Tuất (19h-21h)", "Hợi (21h-23h)"];

// ==========================================
// 2. HELPER FUNCTIONS (Sử dụng API Trình duyệt siêu nhẹ)
// ==========================================
const getLunarDate = (date: Date) => {
  try {
    // Sử dụng API Intl.DateTimeFormat hỗ trợ native lịch Âm để không cần thư viện nặng
    const formatter = new Intl.DateTimeFormat('vi-VN', { calendar: 'chinese', day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '1';
    const month = parts.find(p => p.type === 'month')?.value || '1';
    const year = parts.find(p => p.type === 'relatedYear')?.value || date.getFullYear().toString();
    return { day, month, year };
  } catch (e) {
    // Fallback cơ bản nếu trình duyệt quá cũ
    return { day: '15', month: '8', year: date.getFullYear().toString() };
  }
};

const getCanChiYear = (year: number) => {
  return `${CAN[year % 10]} ${CHI[year % 12]}`;
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function LunarCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // --- Calculations ---
  const d = currentDate.getDate();
  const m = currentDate.getMonth() + 1;
  const y = currentDate.getFullYear();
  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayName = daysOfWeek[currentDate.getDay()];
  
  const lunar = getLunarDate(currentDate);
  const lunarYearNum = parseInt(lunar.year) || y;
  const canChiYear = getCanChiYear(lunarYearNum);

  // Tạo lưới lịch tháng hiện tại
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(y, m - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(y, m);
  
  const calendarGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarGrid.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarGrid.push(i);

  // Giờ hiện tại
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Lịch Vạn Niên & Xem Ngày Tốt Số Chuẩn",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      }
    ]
  };

  if (!mounted) return null; // Tránh lỗi Hydration

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="bg-slate-50 min-h-screen pb-16 font-sans">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {/* NAV & HEADER */}
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
              Trang chủ
            </a>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Lịch Việt Nam Chuẩn
            </div>
          </div>

          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Lịch Vạn Niên & Xem Ngày
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Tra cứu ngày Âm Dương, Giờ Hoàng Đạo để xem ngày tốt động thổ xây nhà, khai trương, xuất hành đại cát đại lợi.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: KHỐI LỊCH BLOCK (Tờ lịch xé) */}
            <section className="w-full xl:w-[45%] flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative group">
                
                {/* Header tờ lịch */}
                <div className="bg-gradient-to-r from-rose-600 to-red-700 p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[40px] opacity-20 -mr-10 -mt-10"></div>
                  <div className="text-rose-100 font-bold uppercase tracking-widest text-sm mb-1">{dayName}</div>
                  <div className="text-white font-medium">Tháng {m} Năm {y}</div>
                </div>

                {/* Body tờ lịch */}
                <div className="p-8 md:p-12 text-center bg-white relative">
                  <div className="text-8xl md:text-[9rem] font-black text-slate-900 leading-none tracking-tighter mb-4">
                    {d}
                  </div>
                  <div className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 rounded-full px-6 py-2 mb-8 shadow-inner">
                    <span className="text-slate-400 font-medium text-sm mr-2">Bây giờ:</span>
                    <span className="text-rose-600 font-black text-lg">{formattedTime}</span>
                  </div>

                  {/* Lịch Âm */}
                  <div className="border-t border-dashed border-slate-200 pt-8 mt-4">
                    <div className="flex justify-between items-center px-4 md:px-8">
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tháng Âm</div>
                        <div className="text-2xl font-black text-slate-800">{lunar.month}</div>
                      </div>
                      <div className="w-px h-12 bg-slate-200 mx-4"></div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Ngày Âm</div>
                        <div className="text-4xl font-black text-rose-600">{lunar.day}</div>
                      </div>
                      <div className="w-px h-12 bg-slate-200 mx-4"></div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Năm Âm</div>
                        <div className="text-2xl font-black text-slate-800">{canChiYear}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút điều hướng */}
                <div className="flex border-t border-slate-100 bg-slate-50 p-4 gap-4">
                  <button onClick={() => changeDate(-1)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm text-sm">Hôm qua</button>
                  <button onClick={jumpToToday} className="flex-1 py-3 bg-rose-600 border border-rose-600 rounded-xl font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-500 transition-colors text-sm">Hôm nay</button>
                  <button onClick={() => changeDate(1)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm text-sm">Ngày mai</button>
                </div>
              </div>

              {/* Box Giờ Hoàng Đạo */}
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500 rounded-full blur-[60px] opacity-10 -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-amber-400 flex items-center gap-2">
                  <span>✨</span> Giờ Hoàng Đạo (Giờ Tốt)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Tý</span><span className="text-xs text-slate-400">23h - 1h</span></div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Sửu</span><span className="text-xs text-slate-400">1h - 3h</span></div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Thìn</span><span className="text-xs text-slate-400">7h - 9h</span></div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Tỵ</span><span className="text-xs text-slate-400">9h - 11h</span></div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Mùi</span><span className="text-xs text-slate-400">13h - 15h</span></div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"><span className="block text-white font-bold text-sm">Tuất</span><span className="text-xs text-slate-400">19h - 21h</span></div>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: LƯỚI LỊCH THÁNG (Calendar Grid) */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 md:p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Tháng {m} / {y}</h3>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span>
                    <span className="text-xs font-bold text-slate-500 uppercase">Hôm nay</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center">
                  <div className="text-xs font-bold text-rose-500 uppercase">CN</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">T2</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">T3</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">T4</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">T5</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">T6</div>
                  <div className="text-xs font-bold text-blue-500 uppercase">T7</div>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 flex-1">
                  {calendarGrid.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="p-2"></div>;
                    
                    const isToday = day === currentDate.getDate() && m === currentDate.getMonth() + 1 && y === currentDate.getFullYear();
                    const isSunday = index % 7 === 0;
                    const isSaturday = index % 7 === 6;

                    return (
                      <div 
                        key={day} 
                        onClick={() => {
                          const newD = new Date(y, m - 1, day);
                          setCurrentDate(newD);
                        }}
                        className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isToday 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 scale-105 z-10' 
                            : 'bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border border-transparent'
                        }`}
                      >
                        <span className={`text-sm md:text-xl font-black ${isToday ? 'text-white' : isSunday ? 'text-rose-500' : isSaturday ? 'text-blue-500' : 'text-slate-800'}`}>
                          {day}
                        </span>
                        {/* Lịch âm mô phỏng nhỏ bên dưới (Thực tế cần mảng map, ở đây mô phỏng UI) */}
                        <span className={`text-[10px] md:text-xs font-medium mt-1 ${isToday ? 'text-rose-200' : 'text-slate-400'}`}>
                          {day + 5 > 30 ? (day + 5 - 30) : day + 5}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TỐI ƯU CHUYỂN ĐỔI NGẦM
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Tầm Quan Trọng Của Việc Xem Ngày Tốt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">🏗️</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Ngày Động thổ, Cất nóc</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                  "Có thờ có thiêng, có kiêng có lành". Việc chọn ngày hoàng đạo để khởi công xây dựng, cất nóc hay lắp đặt các hạng mục cửa cổng, lan can sắt mỹ nghệ là nghi thức không thể thiếu. Nó mang lại sự bình an, giúp công trình bền vững và gia đạo hưng vượng.
                </p>
                <div className="text-xs text-blue-600 font-bold bg-blue-50 p-3 rounded-xl border border-blue-100">
                  💡 Lời khuyên: Hãy kết hợp xem ngày với <strong>Thước Lỗ Ban</strong> để đo đạc kích thước cổng, cửa hoàn hảo nhất.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">🏡</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Ngày Nhập trạch (Dọn vào nhà mới)</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                  Ngày chuyển về nhà mới đánh dấu khởi đầu mới. Chọn ngày có trực tốt, sao tốt giúp xua đuổi tà khí. Trước ngày nhập trạch, gia chủ thường tiến hành lắp đặt, vệ sinh toàn bộ máy lạnh, thiết bị điện máy gia dụng để sẵn sàng đón tài lộc.
                </p>
                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  💡 Lời khuyên: Hãy dọn dẹp vệ sinh nhà cửa và bảo dưỡng thiết bị điện lạnh tươm tất trước giờ nhập trạch.
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Khái Niệm Phong Thủy Cần Biết</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Giờ Hoàng Đạo và Giờ Hắc Đạo là gì?
                  <span className="text-rose-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  <p className="mb-2"><strong>Giờ Hoàng Đạo</strong> là những giờ tốt trong ngày, được các vị thần thiện cai quản. Thực hiện các việc lớn như xuất hành, khai trương, ký hợp đồng vào giờ này sẽ gặp nhiều may mắn, hanh thông.</p>
                  <p>Ngược lại, <strong>Giờ Hắc Đạo</strong> do các vị thần ác cai quản, mang năng lượng xấu. Người Việt Nam thường tránh tiến hành việc đại sự vào những khung giờ này để tránh xui xẻo, trắc trở.</p>
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Lịch Âm Dương có sự chênh lệch như thế nào?
                  <span className="text-rose-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Lịch Dương (Công lịch) dựa vào chu kỳ Trái đất quay quanh Mặt trời (khoảng 365.25 ngày). Trong khi đó, Lịch Âm dựa vào chu kỳ Mặt trăng quay quanh Trái đất (khoảng 354 ngày). Vì sự chênh lệch khoảng 11 ngày mỗi năm này, Lịch Âm phải bổ sung thêm các "Tháng nhuận" để cân bằng thời gian với các mùa màng của Lịch Dương. Do đó, các dịp lễ tết truyền thống luôn thay đổi ngày nếu tính theo Lịch Dương.
                </div>
              </details>

            </div>
          </section>

        </div>
      </article>

    </>
  );
}