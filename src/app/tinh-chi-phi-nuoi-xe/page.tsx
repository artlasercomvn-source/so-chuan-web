"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ
// ==========================================
const CHART_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function CarMaintenanceCalculator() {
  const [distance, setDistance] = useState<string>("1500");
  const [fuelConsumption, setFuelConsumption] = useState<string>("7.5");
  const [fuelPrice, setFuelPrice] = useState<string>("24000");
  
  const [parkingFee, setParkingFee] = useState<string>("1500000");
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<string>("500000");
  const [yearlyFixedCost, setYearlyFixedCost] = useState<string>("15000000"); // Bảo hiểm, phí đường bộ, đăng kiểm

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedDist = localStorage.getItem('car_dist');
    const savedCons = localStorage.getItem('car_cons');
    const savedPrice = localStorage.getItem('car_price_fuel');
    const savedPark = localStorage.getItem('car_park');
    const savedMaint = localStorage.getItem('car_maint');
    const savedYearly = localStorage.getItem('car_yearly');
    
    if (savedDist) setDistance(savedDist);
    if (savedCons) setFuelConsumption(savedCons);
    if (savedPrice) setFuelPrice(savedPrice);
    if (savedPark) setParkingFee(savedPark);
    if (savedMaint) setMonthlyMaintenance(savedMaint);
    if (savedYearly) setYearlyFixedCost(savedYearly);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation Logic ---
  const result = useMemo(() => {
    const dist = parseFloat(distance.replace(/\D/g, '')) || 0;
    const cons = parseFloat(fuelConsumption) || 0;
    const price = parseFloat(fuelPrice.replace(/\D/g, '')) || 0;
    
    const park = parseFloat(parkingFee.replace(/\D/g, '')) || 0;
    const maint = parseFloat(monthlyMaintenance.replace(/\D/g, '')) || 0;
    const yearlyFix = parseFloat(yearlyFixedCost.replace(/\D/g, '')) || 0;

    // Tính chi phí nhiên liệu 1 tháng
    const monthlyFuelCost = (dist / 100) * cons * price;
    
    // Chi phí cố định hàng tháng (đã chia đều các khoản phí năm)
    const amortizedYearlyCost = yearlyFix / 12;
    const totalMonthlyCost = monthlyFuelCost + park + maint + amortizedYearlyCost;
    const totalYearlyCost = totalMonthlyCost * 12;

    const costBreakdown = [
      { name: 'Nhiên liệu', value: monthlyFuelCost, color: CHART_COLORS[0] },
      { name: 'Gửi xe & Cầu đường', value: park, color: CHART_COLORS[1] },
      { name: 'Bảo dưỡng & Rửa xe', value: maint, color: CHART_COLORS[2] },
      { name: 'Phí cố định (Bảo hiểm, Đăng kiểm...)', value: amortizedYearlyCost, color: CHART_COLORS[3] }
    ];

    return { monthlyFuelCost, amortizedYearlyCost, totalMonthlyCost, totalYearlyCost, costBreakdown };
  }, [distance, fuelConsumption, fuelPrice, parkingFee, monthlyMaintenance, yearlyFixedCost]);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính chi phí nuôi xe ô tô hàng tháng",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="bg-slate-50 min-h-screen pb-16 font-sans">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {/* NAV & HEADER */}
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
              Trang chủ
            </a>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
              Xuất PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Dự Toán Chi Phí Nuôi Xe
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Tính toán chính xác tổng chi phí duy trì ô tô hàng tháng và hàng năm. Bao gồm xăng xe, gửi bãi, bảo hiểm và phí bảo dưỡng định kỳ.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[45%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm mb-4 pb-2 border-b border-slate-100">1. Biến Phí (Theo tần suất sử dụng)</h3>
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Số km đi 1 tháng</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                      value={distance} 
                      onChange={(e) => updateState(setDistance, 'car_dist', e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Lít / 100km</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                      value={fuelConsumption} 
                      onChange={(e) => { 
                        const val = e.target.value.replace(/[^0-9.]/g, ''); 
                        if (val.split('.').length <= 2) updateState(setFuelConsumption, 'car_cons', val); 
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Đơn giá Xăng / Dầu (VNĐ/Lít)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                    value={fuelPrice} 
                    onChange={(e) => updateState(setFuelPrice, 'car_price_fuel', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
              </div>

              <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm mb-4 pb-2 border-b border-slate-100">2. Định Phí (Bắt buộc & Duy trì)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Gửi bãi, cầu đường (Tháng)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-right" 
                    value={parkingFee} 
                    onChange={(e) => updateState(setParkingFee, 'car_park', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Rửa xe, bảo dưỡng (Dự tính / Tháng)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-right" 
                    value={monthlyMaintenance} 
                    onChange={(e) => updateState(setMonthlyMaintenance, 'car_maint', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Phí cố định 1 Năm (Bảo hiểm thân vỏ, Đăng kiểm...)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-rose-600 focus:ring-4 focus:ring-rose-100 outline-none transition-all shadow-inner text-right" 
                    value={yearlyFixedCost} 
                    onChange={(e) => updateState(setYearlyFixedCost, 'car_yearly', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
              </div>

            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 print:border">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-4 relative z-10 print:text-slate-600 text-blue-400">
                  TỔNG CHI PHÍ ƯỚC TÍNH (THÁNG)
                </h3>
                
                <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 relative z-10 break-words print:text-black text-white">
                  {formatCurrency(result.totalMonthlyCost)} <span className="text-xl md:text-2xl font-bold opacity-60">đ</span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-slate-700/50 relative z-10 print:border-slate-200">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Chỉ riêng Xăng / Dầu</div>
                    <div className="text-2xl font-bold text-rose-400 print:text-slate-800 break-words">{formatCurrency(result.monthlyFuelCost)}đ</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Tổng chi phí 1 Năm</div>
                    <div className="text-2xl font-bold text-white print:text-slate-800 break-words">{formatCurrency(result.totalYearlyCost)}đ</div>
                  </div>
                </div>
              </div>

              {/* BIỂU ĐỒ CƠ CẤU */}
              <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col justify-center print:hidden">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-6 text-center">Tỷ trọng chi phí duy trì hàng tháng</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-48 w-full md:w-1/2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={result.costBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} 
                          paddingAngle={3} dataKey="value" stroke="none"
                        >
                          {result.costBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 outline-none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `${formatCurrency(value)} đ`} 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center gap-3">
                    {result.costBreakdown.map((item, idx) => {
                      if (item.value === 0) return null;
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                            <span className="font-medium text-slate-600 truncate">{item.name}</span>
                          </div>
                          <span className="font-black text-slate-900 shrink-0 ml-2">{((item.value / result.totalMonthlyCost) * 100).toFixed(0)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              
            </section>
          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TIME-ON-SITE
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">Tối Ưu Hóa Chi Phí Nuôi Xe Ô Tô</h2>
            <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                Nuôi một chiếc ô tô không chỉ bao gồm tiền xăng và bãi đỗ. Để chiếc xe luôn vận hành êm ái và giữ giá trị chuyển nhượng cao, việc tuân thủ lịch bảo dưỡng định kỳ là yếu tố sống còn. 
              </p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                Ví dụ với các dòng xe sedan hạng D cỡ trung (như Camry 2.0E), việc duy trì lịch thay dầu động cơ bằng các dòng <strong>nhớt tổng hợp toàn phần (như Mobil 1 ESP 5W-30)</strong> kết hợp sử dụng bộ lọc chính hãng trước mỗi chuyến đi dài không chỉ bảo vệ các chi tiết máy mà còn tối ưu đáng kể mức tiêu hao nhiên liệu trên đường trường.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-blue-600 font-black mb-1">Định phí hàng năm</div>
                  <div className="text-xs text-slate-500">Bảo hiểm TNDS, Phí bảo trì đường bộ, Bảo hiểm thân vỏ (tự nguyện). Gốc này chiếm khoảng 10-15 triệu/năm tùy giá trị xe.</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-amber-600 font-black mb-1">Biến phí hàng tháng</div>
                  <div className="text-xs text-slate-500">Xăng xe, vé trạm thu phí BOT, tiền gửi bãi, chi phí rửa xe và hao mòn lốp/nhớt theo mốc kilomet.</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Bảo dưỡng định kỳ thường tốn bao nhiêu?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Tùy thuộc vào phân khúc xe. Tại các mốc bảo dưỡng nhỏ (5.000km), chi phí thay nhớt, lọc dầu chỉ rơi vào khoảng 800.000đ - 1.500.000đ. Tuy nhiên, ở các mốc bảo dưỡng lớn (40.000km hoặc 80.000km), bạn sẽ cần thay thế thêm dầu hộp số, bugi, nước làm mát, vệ sinh buồng đốt nên chi phí có thể dao động từ 5.000.000đ đến hơn 10.000.000đ.
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Có nên mua Bảo hiểm thân vỏ không?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Đây là khoản đầu tư phòng ngừa rủi ro cực kỳ xứng đáng, đặc biệt nếu bạn là lái mới hoặc thường xuyên di chuyển ở các khu vực giao thông đông đúc, đường hẹp. Mức phí thông thường khoảng 1.2% - 1.5% giá trị thực tế của xe. Chỉ một vết xước sâu phải sơn lại cả mảng cửa cũng đã tương đương với số tiền bạn đóng bảo hiểm cả năm.
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