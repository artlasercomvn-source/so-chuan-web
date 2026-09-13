"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function AC_BTU_Calculator() {
  const [area, setArea] = useState<string>("20");
  const [height, setHeight] = useState<string>("3.5");
  const [roomType, setRoomType] = useState<number>(1.0); // Hệ số phòng
  
  // Các yếu tố phụ tải nhiệt
  const [isWestFacing, setIsWestFacing] = useState<boolean>(false);
  const [isTopFloor, setIsTopFloor] = useState<boolean>(false);
  const [manyWindows, setManyWindows] = useState<boolean>(false);

  useEffect(() => {
    const s_area = localStorage.getItem('ac_area');
    const s_height = localStorage.getItem('ac_height');
    if (s_area) setArea(s_area);
    if (s_height) setHeight(s_height);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    if (key) localStorage.setItem(key, value.toString());
  };

  // --- Thuật toán Nhiệt lạnh Chuẩn kỹ sư ---
  const result = useMemo(() => {
    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;
    if (a <= 0 || h <= 0) return null;

    // 1. Thể tích phòng (m3)
    const volume = a * h;

    // 2. Công suất cơ bản (200 BTU / 1 m3 khối không khí)
    let baseBTU = volume * 200;

    // 3. Nhân hệ số loại phòng (Phòng ngủ = 1, Khách = 1.1, Bếp = 1.15)
    baseBTU = baseBTU * roomType;

    // 4. Cộng phụ tải nhiệt thất thoát
    if (isWestFacing) baseBTU *= 1.15; // Nắng chiếu tường +15%
    if (isTopFloor) baseBTU *= 1.15;   // Áp mái tôn nóng +15%
    if (manyWindows) baseBTU *= 1.10;  // Thất thoát qua kính +10%

    // 5. Làm tròn và Phân loại thiết bị đề xuất
    const requiredBTU = Math.round(baseBTU);
    let recommend = { btu: "9.000", hp: "1.0 HP", desc: "Thích hợp cho không gian nhỏ, phòng ngủ cá nhân." };
    
    if (requiredBTU > 28000) { recommend = { btu: "Máy Trung Tâm / Multi", hp: "Nhiều máy", desc: "Diện tích quá lớn, nên dùng điều hòa âm trần hoặc kết hợp nhiều máy." }; }
    else if (requiredBTU > 21000) { recommend = { btu: "24.000", hp: "2.5 HP", desc: "Lựa chọn tối ưu cho không gian siêu rộng, phòng khách mở." }; }
    else if (requiredBTU > 15000) { recommend = { btu: "18.000", hp: "2.0 HP", desc: "Làm lạnh sâu cho phòng khách lớn, phòng có vách ngăn." }; }
    else if (requiredBTU > 10500) { recommend = { btu: "12.000", hp: "1.5 HP", desc: "Công suất phổ biến nhất cho phòng ngủ master, phòng khách nhỏ." }; }

    return { volume: volume.toFixed(1), requiredBTU, recommend };
  }, [area, height, roomType, isWestFacing, isTopFloor, manyWindows]);

  return (
    <>
      <main className="bg-slate-50 min-h-screen pb-16 font-sans">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Trang chủ
            </a>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Tính Công Suất Điều Hòa
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Áp dụng công thức Nhiệt động học qua Thể tích (m³) và bóc tách tự động phụ tải nhiệt từ Hướng nắng, Mái nhà.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            {/* NHẬP LIỆU */}
            <section className="w-full xl:w-[45%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit">
              <div className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Diện tích (m²)</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-sky-700 focus:ring-4 focus:ring-sky-100 outline-none transition-all shadow-inner text-center" 
                      value={area} onChange={(e) => updateState(setArea, 'ac_area', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chiều cao trần (m)</label>
                    <input type="number" step="0.1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-sky-700 focus:ring-4 focus:ring-sky-100 outline-none transition-all shadow-inner text-center" 
                      value={height} onChange={(e) => updateState(setHeight, 'ac_height', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Loại phòng sử dụng</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => updateState(setRoomType, '', 1.0)} className={`p-3 rounded-xl font-bold text-xs transition-all ${roomType === 1.0 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>Phòng Ngủ</button>
                    <button onClick={() => updateState(setRoomType, '', 1.1)} className={`p-3 rounded-xl font-bold text-xs transition-all ${roomType === 1.1 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>Phòng Khách</button>
                    <button onClick={() => updateState(setRoomType, '', 1.15)} className={`p-3 rounded-xl font-bold text-xs transition-all ${roomType === 1.15 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>Phòng Bếp</button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Các yếu tố thất thoát nhiệt (Chọn nếu có)</label>
                  <label className="flex items-center cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500" checked={isWestFacing} onChange={(e) => updateState(setIsWestFacing, '', e.target.checked)} />
                    <span className="ml-3 text-sm font-bold text-slate-800">Tường bị nắng chiếu trực tiếp (Hướng Tây)</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500" checked={isTopFloor} onChange={(e) => updateState(setIsTopFloor, '', e.target.checked)} />
                    <span className="ml-3 text-sm font-bold text-slate-800">Phòng áp mái, trần tôn (Rất nóng)</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500" checked={manyWindows} onChange={(e) => updateState(setManyWindows, '', e.target.checked)} />
                    <span className="ml-3 text-sm font-bold text-slate-800">Phòng có nhiều cửa kính lớn</span>
                  </label>
                </div>
              </div>
            </section>

            {/* KẾT QUẢ */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              {result && (
                <>
                  <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                    
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-sky-400 relative z-10">CÔNG SUẤT LÀM LẠNH YÊU CẦU</h3>
                    <div className="text-5xl md:text-6xl font-black tracking-tight mb-4 relative z-10 text-white">
                      {formatCurrency(result.requiredBTU)} <span className="text-2xl font-bold opacity-60">BTU/h</span>
                    </div>
                    <div className="text-sm font-medium text-slate-400 relative z-10 border-b border-slate-700 pb-6 mb-6">
                      (Đã tính toán cho không gian thể tích {result.volume} m³)
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400 relative z-10">THIẾT BỊ ĐỀ XUẤT CHO BẠN</h3>
                    <div className="flex items-baseline gap-4 relative z-10 mb-2">
                      <div className="text-3xl md:text-4xl font-black text-emerald-400">{result.recommend.btu} <span className="text-xl">BTU</span></div>
                      <div className="text-xl font-bold text-white opacity-80">(Tương đương {result.recommend.hp})</div>
                    </div>
                    <p className="text-sm text-slate-300 relative z-10">{result.recommend.desc}</p>
                  </div>

                  {/* CẢNH BÁO BẢO DƯỠNG */}
                  <div className="bg-sky-50 border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">⚠️</div>
                      <div>
                        <h4 className="font-black text-sky-900 mb-2">Tại sao chọn đúng BTU lại cực kỳ quan trọng?</h4>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                          Nếu chọn máy <strong>thiếu công suất</strong>, máy nén (Block) sẽ phải chạy liên tục 100% không ngừng nghỉ, gây tốn điện gấp đôi và máy sẽ hỏng chỉ sau 1 năm. Nếu chọn máy quá dư, gây lãng phí tiền mua ban đầu.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <article className="bg-white border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Bí Quyết Vận Hành Máy Lạnh Tiết Kiệm Điện</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Một chiếc điều hòa có chuẩn xác công suất đến đâu, nhưng nếu không được <strong>bảo dưỡng và vệ sinh định kỳ (3-6 tháng/lần)</strong> thì lưới lọc sẽ bị bịt kín bởi bụi bẩn. Khi đó, hơi lạnh không thể thoát ra ngoài, máy nén hoạt động quá tải dẫn đến hóa đơn tiền điện tăng sốc.
              </p>
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xl mb-2 block">🔧</span>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Đặc biệt tại khu vực thủ đô, lượng bụi mịn rất cao. Việc tìm kiếm chuyên gia điện lạnh am hiểu kỹ thuật để kiểm tra gas, vệ sinh dàn nóng/dàn lạnh định kỳ là giải pháp tối ưu nhất. Các nền tảng sửa chữa gia dụng uy tín tại các phường nội thành luôn cung cấp quy trình bảo dưỡng chuẩn kỹ sư, giúp máy vận hành êm ái và kéo dài tuổi thọ.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}