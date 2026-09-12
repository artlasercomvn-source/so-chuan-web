"use client";

import React, { useState, useEffect, useMemo } from "react";

// ==========================================
// 1. CẤU HÌNH THUẬT TOÁN THƯỚC LỖ BAN
// ==========================================
// Thước 52.2cm (Đo khoảng không thông thủy: Cửa chính, cổng, cửa sổ)
const RULER_52_2 = {
  cycle: 522, // mm
  spans: [
    { name: "Quý Nhân", isGood: true, desc: "Gia cảnh khả quan, làm ăn phát đạt, bạn bè trung thành, con cái thông minh." },
    { name: "Hiểm Họa", isGood: false, desc: "Tài lộc tiêu tán, trôi dạt tha hương, cuộc sống long đong, hay ốm đau." },
    { name: "Thiên Tai", isGood: false, desc: "Coi chừng ốm đau nặng, chết chóc, mất của, vợ chồng bất hòa." },
    { name: "Thiên Tài", isGood: true, desc: "Đón lộc từ trời, tài năng kiệt xuất, con cái hiếu thảo, gia đạo an vui." },
    { name: "Nhân Lộc", isGood: true, desc: "Có lộc dồi dào, trí tuệ minh mẫn, an tâm phát triển sự nghiệp." },
    { name: "Cô Độc", isGood: false, desc: "Hao người tốn của, biệt ly, tửu sắc vô độ đến mức tàn mạt." },
    { name: "Thiên Tặc", isGood: false, desc: "Đề phòng bệnh tật bất ngờ, tai ương, kiện tụng, tù tội." },
    { name: "Tể Tướng", isGood: true, desc: "Hanh thông mọi mặt, sinh con quý tử, công danh thăng tiến." }
  ]
};

// Thước 42.9cm (Đo khối đặc Dương trạch: Bậc cầu thang, bệ bếp, giường)
const RULER_42_9 = {
  cycle: 429, // mm
  spans: [
    { name: "Tài", isGood: true, desc: "Nghênh đón tiền tài, đức độ, thêm đinh (con trai)." },
    { name: "Bệnh", isGood: false, desc: "Thoái tài, kiện tụng, ốm đau, thị phi." },
    { name: "Ly", isGood: false, desc: "Xa cách, mất tiền của, hao tổn của cải." },
    { name: "Nghĩa", isGood: true, desc: "Sinh con quý tử, gặp nhiều may mắn, đại cát đại lợi." },
    { name: "Quan", isGood: true, desc: "Tiến lên đường công danh, thi cử đỗ đạt, giàu có." },
    { name: "Kiếp", isGood: false, desc: "Tai nạn, chết chóc, mất của, bị cướp." },
    { name: "Hại", isGood: false, desc: "Bệnh tật, cãi vã, tai họa đến bất ngờ." },
    { name: "Bản", isGood: true, desc: "Tiền tài gõ cửa, đỗ đạt, công việc trôi chảy." }
  ]
};

// Thước 38.8cm (Đo Âm phần & Nội thất: Bàn thờ, tủ)
const RULER_38_8 = {
  cycle: 388, // mm
  spans: [
    { name: "Đinh", isGood: true, desc: "Đón phúc lộc, sinh con trai, tài lộc dồi dào." },
    { name: "Hại", isGood: false, desc: "Khẩu thiệt thị phi, ốm đau bệnh tật, tai họa." },
    { name: "Vượng", isGood: true, desc: "Thiên đức, hỷ sự, thêm người thêm của." },
    { name: "Khổ", isGood: false, desc: "Mất của, vướng kiện tụng, không có con nối dõi." },
    { name: "Nghĩa", isGood: true, desc: "Đại cát, tài lộc dồi dào, thêm người thêm của." },
    { name: "Quan", isGood: true, desc: "Thăng quan tiến chức, phú quý, thi đỗ." },
    { name: "Tử", isGood: false, desc: "Chết chóc, xa xứ, mất tiền của." },
    { name: "Hưng", isGood: true, desc: "Đỗ đạt, thêm con trai, gia đạo êm ấm." },
    { name: "Thất", isGood: false, desc: "Cô độc, tháo lui, hao tài tốn của." },
    { name: "Tài", isGood: true, desc: "Nghênh khách, rước tài lộc, tiến bảo." }
  ]
};

const calculateFengShui = (lengthMm: number, rulerDef: { cycle: number, spans: any[] }) => {
  const spanLength = rulerDef.cycle / rulerDef.spans.length;
  const position = lengthMm % rulerDef.cycle;
  const index = Math.floor(position / spanLength);
  
  // Tính kích thước Đẹp gần nhất nếu rơi vào cung Xấu
  let nearestGood = null;
  if (!rulerDef.spans[index]?.isGood) {
    let forward = lengthMm;
    let backward = lengthMm;
    let found = false;
    for (let i = 1; i <= spanLength * 2; i++) {
      if (!found) {
        const pFwd = (forward + i) % rulerDef.cycle;
        const iFwd = Math.floor(pFwd / spanLength);
        if (rulerDef.spans[iFwd]?.isGood) {
          nearestGood = forward + i;
          found = true;
          break;
        }
        const pBwd = (backward - i) >= 0 ? (backward - i) % rulerDef.cycle : ((backward - i) % rulerDef.cycle + rulerDef.cycle) % rulerDef.cycle;
        const iBwd = Math.floor(pBwd / spanLength);
        if (rulerDef.spans[iBwd]?.isGood) {
          nearestGood = backward - i;
          found = true;
          break;
        }
      }
    }
  }

  return {
    span: rulerDef.spans[index],
    nearestGood
  };
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function FengShuiRuler() {
  const [measurement, setMeasurement] = useState<string>("810"); // mm

  // --- Smart Memory ---
  useEffect(() => {
    const savedMeasurement = localStorage.getItem('fs_measure');
    if (savedMeasurement) setMeasurement(savedMeasurement);
  }, []);

  const updateState = (val: string) => {
    setMeasurement(val);
    localStorage.setItem('fs_measure', val);
  };

  const lengthMm = parseInt(measurement) || 0;

  const res522 = useMemo(() => calculateFengShui(lengthMm, RULER_52_2), [lengthMm]);
  const res429 = useMemo(() => calculateFengShui(lengthMm, RULER_42_9), [lengthMm]);
  const res388 = useMemo(() => calculateFengShui(lengthMm, RULER_38_8), [lengthMm]);

  return (
    <>
      <main className="bg-slate-50 min-h-screen pb-16 font-sans">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
              Trang chủ
            </a>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Thuật toán Chuẩn gốc
            </div>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Thước Lỗ Ban Phong Thủy
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Chỉ cần nhập kích thước, hệ thống sẽ tự động bóc tách cung Cát - Hung trên cả 3 chuẩn thước lỗ ban thông dụng nhất hiện nay.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP KÍCH THƯỚC */}
            <section className="w-full xl:w-[35%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4 text-center uppercase tracking-wider">
                    Nhập kích thước cần tra (mm)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full py-6 md:py-8 bg-slate-50 border border-slate-200 rounded-3xl font-black text-5xl md:text-6xl text-slate-800 focus:ring-4 focus:ring-rose-100 focus:border-rose-500 outline-none transition-all shadow-inner text-center tracking-tight" 
                      value={measurement} 
                      onChange={(e) => updateState(e.target.value.replace(/\D/g, ''))} 
                      autoFocus
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xl">mm</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => updateState("810")} className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Cửa phòng (810mm)</button>
                  <button onClick={() => updateState("2820")} className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Cổng 2 cánh (2820mm)</button>
                  <button onClick={() => updateState("1270")} className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Bàn thờ (1270mm)</button>
                  <button onClick={() => updateState("810")} className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Bệ bếp (810mm)</button>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ TRỰC QUAN */}
            <section className="w-full xl:w-[65%] flex flex-col gap-6">
              
              {/* Thước 52.2cm (Quan trọng nhất cho Cổng, Cửa) */}
              <div className={`rounded-[2rem] shadow-sm border p-6 md:p-8 transition-all duration-300 relative overflow-hidden ${res522.span?.isGood ? 'bg-gradient-to-br from-rose-600 to-red-700 border-rose-500 shadow-rose-200' : 'bg-slate-800 border-slate-700'}`}>
                {res522.span?.isGood && <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[80px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <h3 className={`text-xs md:text-sm font-bold tracking-widest uppercase mb-1 ${res522.span?.isGood ? 'text-rose-200' : 'text-slate-400'}`}>
                      Thước 52.2cm (Thông Thủy)
                    </h3>
                    <p className={`text-[10px] md:text-xs ${res522.span?.isGood ? 'text-rose-100' : 'text-slate-500'}`}>Đo khoảng lọt sáng: Cổng, Cửa đi, Cửa sổ.</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-sm uppercase ${res522.span?.isGood ? 'bg-white text-rose-600' : 'bg-slate-700 text-slate-300'}`}>
                    {res522.span?.isGood ? 'ĐẠI CÁT' : 'CUNG HUNG'}
                  </div>
                </div>

                <div className="mt-6 md:mt-8 relative z-10">
                  <div className={`text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 ${res522.span?.isGood ? 'text-white' : 'text-slate-200'}`}>
                    {res522.span?.name || '--'}
                  </div>
                  <p className={`text-sm md:text-base leading-relaxed ${res522.span?.isGood ? 'text-rose-50' : 'text-slate-400'}`}>
                    {res522.span?.desc || 'Nhập kích thước để xem giải luận.'}
                  </p>
                </div>

                {/* Smart Suggestion nếu vào cung xấu */}
                {!res522.span?.isGood && res522.nearestGood && (
                  <div className="mt-6 pt-5 border-t border-slate-700 relative z-10">
                    <div className="text-xs text-emerald-400 font-bold uppercase mb-1">💡 Gợi ý kích thước Cát tường gần nhất:</div>
                    <div className="text-xl font-black text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors inline-block" onClick={() => updateState(res522.nearestGood!.toString())}>
                      {res522.nearestGood} mm
                    </div>
                  </div>
                )}
              </div>

              {/* Grid 2 thước còn lại */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Thước 42.9cm (Dương Trạch) */}
                <div className={`rounded-[2rem] shadow-sm border p-5 md:p-6 transition-all duration-300 ${res429.span?.isGood ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className={`text-xs font-bold tracking-widest uppercase mb-1 ${res429.span?.isGood ? 'text-amber-600' : 'text-slate-500'}`}>
                    Thước 42.9cm (Dương Trạch)
                  </h3>
                  <p className="text-[10px] text-slate-400 mb-4">Đo khối xây đặc: Bệ bếp, bậc cầu thang.</p>
                  
                  <div className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 ${res429.span?.isGood ? 'text-amber-700' : 'text-slate-700'}`}>
                    {res429.span?.name || '--'}
                  </div>
                  <p className={`text-xs leading-relaxed ${res429.span?.isGood ? 'text-amber-700/80' : 'text-slate-500'}`}>
                    {res429.span?.desc}
                  </p>
                  
                  {!res429.span?.isGood && res429.nearestGood && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Gợi ý kích thước đẹp:</div>
                      <div className="text-lg font-black text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors" onClick={() => updateState(res429.nearestGood!.toString())}>
                        {res429.nearestGood} mm
                      </div>
                    </div>
                  )}
                </div>

                {/* Thước 38.8cm (Âm Phần & Đồ Nội Thất) */}
                <div className={`rounded-[2rem] shadow-sm border p-5 md:p-6 transition-all duration-300 ${res388.span?.isGood ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className={`text-xs font-bold tracking-widest uppercase mb-1 ${res388.span?.isGood ? 'text-blue-600' : 'text-slate-500'}`}>
                    Thước 38.8cm (Âm Phần)
                  </h3>
                  <p className="text-[10px] text-slate-400 mb-4">Đo đồ mộc: Bàn thờ, tủ, phần mộ.</p>
                  
                  <div className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 ${res388.span?.isGood ? 'text-blue-700' : 'text-slate-700'}`}>
                    {res388.span?.name || '--'}
                  </div>
                  <p className={`text-xs leading-relaxed ${res388.span?.isGood ? 'text-blue-700/80' : 'text-slate-500'}`}>
                    {res388.span?.desc}
                  </p>

                  {!res388.span?.isGood && res388.nearestGood && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Gợi ý kích thước đẹp:</div>
                      <div className="text-lg font-black text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors" onClick={() => updateState(res388.nearestGood!.toString())}>
                        {res388.nearestGood} mm
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO TỐI ƯU CỰC MẠNH
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Bí Quyết Chọn Thước Lỗ Ban Chuẩn Phong Thủy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm font-black text-rose-500">52.2</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Thước Thông Thủy</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Chỉ dùng để đo <strong>khoảng lọt sáng, lọt gió</strong>. Các hạng mục áp dụng: Cửa chính, cửa sổ, khoảng lọt lòng của cổng sắt.
                </p>
                <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg">*Tuyệt đối quan trọng khi làm nhà.</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm font-black text-amber-500">42.9</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Thước Dương Trạch</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Dùng để đo các <strong>khối xây đặc</strong>. Ứng dụng để đo chiều cao bậc cầu thang, chiều rộng bệ bếp, kích thước giường ngủ.
                </p>
                <div className="text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded-lg">*Ảnh hưởng đến tài lộc, gia đạo.</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm font-black text-blue-500">38.8</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Thước Âm Phần</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Chuyên dùng để đo các vật phẩm mang tính tâm linh và mộc. Ví dụ: Kích thước ban thờ, sập thờ, tủ thờ, phần mộ tổ tiên.
                </p>
                <div className="text-xs text-blue-600 font-bold bg-blue-50 p-2 rounded-lg">*Ảnh hưởng phúc đức con cháu.</div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp Khi Làm Cổng, Cửa</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Kích thước cửa sổ có cần đo chuẩn Lỗ Ban không?
                  <span className="text-rose-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Theo phong thủy chính phái, <strong>cửa sổ không bắt buộc</strong> phải chuẩn kích thước Lỗ Ban. Nơi quan trọng nhất đón sinh khí vào nhà là Cổng chính và Cửa đi chính (Đại Môn). Tuy nhiên, nếu có thể thiết kế cửa sổ rơi vào cung Đẹp (Thước 52.2cm) thì càng tăng thêm sự an tâm về mặt tâm lý cho gia chủ.
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Kích thước thông thủy là gì? Đo từ đâu đến đâu?
                  <span className="text-rose-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  <p className="mb-2">Kích thước thông thủy (hay còn gọi là lọt sáng, lọt lòng) là khoảng không gian mà ánh sáng hoặc gió có thể đi qua.</p>
                  <p>Ví dụ: Khi làm cổng sắt mỹ nghệ hoặc cửa nhôm kính, bạn <strong>chỉ đo khoảng trống lọt lòng bên trong</strong>, không cộng thêm phần bề dày của khuôn bao (khung cửa). Việc thiết kế cổng, lan can hay cầu thang đòi hỏi sự chính xác cao độ, bạn nên tìm đến các đơn vị thi công uy tín để được tư vấn bản vẽ chuẩn Lỗ Ban ngay từ đầu.</p>
                </div>
              </details>

            </div>
          </section>

        </div>
      </article>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}