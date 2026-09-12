"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ (Biểu giá điện EVN Mới Nhất)
// ==========================================
const EVN_TIERS = [
  { id: 1, name: 'Bậc 1 (0 - 50 kWh)', limit: 50, price: 1806 },
  { id: 2, name: 'Bậc 2 (51 - 100 kWh)', limit: 50, price: 1866 },
  { id: 3, name: 'Bậc 3 (101 - 200 kWh)', limit: 100, price: 2167 },
  { id: 4, name: 'Bậc 4 (201 - 300 kWh)', limit: 100, price: 2729 },
  { id: 5, name: 'Bậc 5 (301 - 400 kWh)', limit: 100, price: 3050 },
  { id: 6, name: 'Bậc 6 (Từ 401 kWh trở lên)', limit: Infinity, price: 3151 },
];

const VAT_RATE = 0.08; // Thuế GTGT 8% áp dụng hiện hành
const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#7f1d1d'];

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ElectricityCalculator() {
  const [inputType, setInputType] = useState<'total' | 'index'>('total');
  const [totalKwh, setTotalKwh] = useState<string>("350");
  const [oldIndex, setOldIndex] = useState<string>("10500");
  const [newIndex, setNewIndex] = useState<string>("10850");

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedType = localStorage.getItem('elec_inputType');
    const savedTotal = localStorage.getItem('elec_total');
    const savedOld = localStorage.getItem('elec_old');
    const savedNew = localStorage.getItem('elec_new');
    
    if (savedType) setInputType(savedType as 'total' | 'index');
    if (savedTotal) setTotalKwh(savedTotal);
    if (savedOld) setOldIndex(savedOld);
    if (savedNew) setNewIndex(savedNew);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation Logic ---
  const result = useMemo(() => {
    let kwh = 0;
    
    if (inputType === 'total') {
      kwh = parseInt(totalKwh.replace(/\D/g, '')) || 0;
    } else {
      const oldVal = parseInt(oldIndex.replace(/\D/g, '')) || 0;
      const newVal = parseInt(newIndex.replace(/\D/g, '')) || 0;
      kwh = Math.max(0, newVal - oldVal);
    }

    let remainingKwh = kwh;
    let totalBeforeVat = 0;
    const breakdown = [];

    for (const tier of EVN_TIERS) {
      if (remainingKwh <= 0) break;
      
      const consumedInTier = Math.min(remainingKwh, tier.limit);
      const costInTier = consumedInTier * tier.price;
      
      totalBeforeVat += costInTier;
      breakdown.push({
        ...tier,
        consumed: consumedInTier,
        cost: costInTier
      });
      
      remainingKwh -= consumedInTier;
    }

    const vatAmount = totalBeforeVat * VAT_RATE;
    const totalAfterVat = totalBeforeVat + vatAmount;

    return { 
      totalKwh: kwh, 
      totalBeforeVat, 
      vatAmount, 
      totalAfterVat, 
      breakdown 
    };
  }, [inputType, totalKwh, oldIndex, newIndex]);

  const chartData = result.breakdown.map((item, index) => ({
    name: `Bậc ${item.id}`,
    value: item.cost,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính tiền điện sinh hoạt EVN",
        "applicationCategory": "UtilitiesApplication",
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
              Xuất Hóa Đơn PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Tính Tiền Điện Sinh Hoạt
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Hệ thống tự động chiết tính hóa đơn tiền điện theo biểu giá 6 bậc thang mới nhất của EVN. Chuẩn xác tới từng đồng.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 print:hidden">
                <button 
                  onClick={() => updateState(setInputType, 'elec_inputType', 'total')} 
                  className={`flex-1 py-3 md:py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all ${inputType === 'total' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Nhập số điện
                </button>
                <button 
                  onClick={() => updateState(setInputType, 'elec_inputType', 'index')} 
                  className={`flex-1 py-3 md:py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all ${inputType === 'index' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Nhập chỉ số Công tơ
                </button>
              </div>

              <div className="space-y-6">
                {inputType === 'total' ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tổng điện năng tiêu thụ (kWh)</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-2xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner text-center" 
                      value={totalKwh} 
                      onChange={(e) => updateState(setTotalKwh, 'elec_total', e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Chỉ số đầu kỳ</label>
                      <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all shadow-inner" 
                        value={oldIndex} 
                        onChange={(e) => updateState(setOldIndex, 'elec_old', e.target.value.replace(/\D/g, ''))} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Chỉ số cuối kỳ</label>
                      <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all shadow-inner" 
                        value={newIndex} 
                        onChange={(e) => updateState(setNewIndex, 'elec_new', e.target.value.replace(/\D/g, ''))} 
                      />
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <p className="text-xs md:text-sm text-blue-800 leading-relaxed font-medium">
                    Giá điện sinh hoạt được tính theo 6 bậc lũy tiến. Dùng càng nhiều, đơn giá ở các bậc sau càng đắt. Thuế suất GTGT hiện hành là 8%.
                  </p>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              
              {/* BOX SMART RESULT */}
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 print:border">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-4 relative z-10 print:text-slate-600 text-amber-400">
                  TỔNG SỐ TIỀN THANH TOÁN (ĐÃ GỒM VAT)
                </h3>
                
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 relative z-10 break-words print:text-black text-white">
                  {formatCurrency(result.totalAfterVat)} <span className="text-2xl font-bold opacity-60">đ</span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-slate-700/50 relative z-10 print:border-slate-200">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Điện năng tiêu thụ</div>
                    <div className="text-2xl font-bold text-white print:text-slate-800">{formatCurrency(result.totalKwh)} <span className="text-sm font-normal text-slate-400">kWh</span></div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Thuế GTGT (8%)</div>
                    <div className="text-2xl font-bold text-amber-400 print:text-slate-800">+{formatCurrency(result.vatAmount)}đ</div>
                  </div>
                </div>
              </div>

              {/* KHỐI BIỂU ĐỒ & BẢNG BÓC TÁCH */}
              {result.totalKwh > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* BIỂU ĐỒ DONUT */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col justify-center print:hidden min-h-[300px]">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4 text-center">Tỷ trọng tiền điện theo bậc</h3>
                    <div className="h-48 md:h-52 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} 
                            paddingAngle={3} dataKey="value" stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `${formatCurrency(value)} đ`} 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {chartData.map((item, idx) => (
                        <div key={idx} className="flex items-center text-[10px] md:text-xs text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BẢNG BÓC TÁCH */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm flex flex-col print:border-none print:shadow-none">
                    <div className="px-5 md:px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Chi tiết tiền điện (Chưa VAT)</h3>
                    </div>
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                      <table className="w-full text-xs md:text-sm text-left text-slate-600 min-w-[300px]">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-4 py-3 font-medium">Bậc</th>
                            <th className="px-4 py-3 font-medium text-right">Sản lượng</th>
                            <th className="px-4 py-3 font-medium text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((tier) => (
                            <tr key={tier.id} className="border-b border-slate-50 hover:bg-amber-50/50 transition-colors">
                              <td className="px-4 py-3.5 font-bold text-slate-800 whitespace-nowrap">Bậc {tier.id}</td>
                              <td className="px-4 py-3.5 text-right font-medium">{tier.consumed} <span className="text-slate-400 text-xs">kWh</span></td>
                              <td className="px-4 py-3.5 text-right font-black text-slate-900">{formatCurrency(tier.cost)}đ</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100/50">
                            <td colSpan={2} className="px-4 py-4 font-black text-slate-800 uppercase text-[10px] md:text-xs text-right">Cộng tiền điện</td>
                            <td className="px-4 py-4 text-right font-black text-blue-600">{formatCurrency(result.totalBeforeVat)} đ</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TIME-ON-SITE
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">Bảng Giá Điện Sinh Hoạt EVN 6 Bậc</h2>
            <p className="text-slate-500 text-center mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Biểu giá bán lẻ điện sinh hoạt áp dụng phương pháp lũy tiến. Sử dụng điện càng nhiều, đơn giá ở các bậc cao sẽ càng đắt đỏ.
            </p>
            
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
              <table className="w-full text-left text-sm md:text-base whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black">
                    <th className="p-4 md:p-5 border-b border-slate-200">Mức sử dụng (Bậc)</th>
                    <th className="p-4 md:p-5 border-b border-slate-200 border-l">Sản lượng (kWh)</th>
                    <th className="p-4 md:p-5 border-b border-slate-200 border-l text-right">Đơn giá (VNĐ/kWh)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 border-b border-slate-100 font-bold text-emerald-600">Bậc 1</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l">Từ 0 - 50 kWh</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l text-right font-black text-slate-800">1.806</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 border-b border-slate-100 font-bold text-blue-600">Bậc 2</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l">Từ 51 - 100 kWh</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l text-right font-black text-slate-800">1.866</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 border-b border-slate-100 font-bold text-indigo-600">Bậc 3</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l">Từ 101 - 200 kWh</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l text-right font-black text-slate-800">2.167</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 border-b border-slate-100 font-bold text-amber-500">Bậc 4</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l">Từ 201 - 300 kWh</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l text-right font-black text-slate-800">2.729</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 border-b border-slate-100 font-bold text-orange-600">Bậc 5</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l">Từ 301 - 400 kWh</td>
                    <td className="p-4 md:p-5 border-b border-slate-100 border-l text-right font-black text-slate-800">3.050</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-rose-50/30">
                    <td className="p-4 md:p-5 font-black text-rose-600">Bậc 6</td>
                    <td className="p-4 md:p-5 border-l border-slate-100">Từ 401 kWh trở lên</td>
                    <td className="p-4 md:p-5 border-l border-slate-100 text-right font-black text-rose-700">3.151</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center px-4">*Đơn giá trên chưa bao gồm Thuế Giá trị gia tăng (VAT). Tùy thời điểm, thuế VAT có thể là 8% hoặc 10%.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">Bí Quyết Tiết Kiệm Điện Hiệu Quả Mùa Hè</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">❄️</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Vệ sinh điều hòa định kỳ</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Điều hòa bám bụi là nguyên nhân số 1 gây "ngốn" điện. Màng lọc kín bụi khiến máy nén phải hoạt động 200% công suất để làm mát. Việc bảo dưỡng, bơm ga và vệ sinh định kỳ giúp thiết bị vận hành êm ái, kéo dài tuổi thọ và <strong>giảm từ 20-30% tiền điện</strong> mỗi tháng.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🌡️</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Sử dụng nhiệt độ hợp lý</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Nên duy trì nhiệt độ điều hòa ở mức 26-28 độ C kết hợp quạt gió. Các chuyên gia điện lạnh khẳng định: Cứ giảm 1 độ C, điều hòa sẽ tiêu tốn thêm khoảng 7-10% điện năng.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🧊</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Kiểm tra gioăng tủ lạnh</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Gioăng cao su cửa tủ lạnh bị chai cứng, hở phễu khiến hơi lạnh thoát ra ngoài liên tục. Việc thay thế gioăng kịp thời giúp máy không bị quá tải.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🔌</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Rút phích cắm khi không dùng</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Ngay cả khi đã tắt bằng điều khiển, Tivi, quạt hay sạc điện thoại vẫn tiêu thụ điện năng ngầm (Chế độ Standby). Hãy tập thói quen rút hẳn phích cắm ra khỏi ổ.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Điện sinh hoạt lũy tiến là gì?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Là cách tính giá điện tăng dần theo các mốc sản lượng tiêu thụ. Theo EVN, 50 số điện đầu tiên được hưởng giá rẻ nhất (Bậc 1). Nếu bạn dùng đến số thứ 51, số điện đó sẽ bị tính theo giá của Bậc 2, đắt hơn Bậc 1. Càng dùng nhiều, các số điện vượt định mức càng bị tính giá rất cao.
                </div>
              </details>
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Làm sao để biết công tơ điện nhà mình chạy đúng?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Cách đơn giản nhất là bạn ngắt tất cả cầu dao tổng (Aptomat) trong nhà. Nếu đĩa nhôm trên công tơ cơ vẫn quay hoặc đèn xung trên công tơ điện tử vẫn nháy liên tục, chứng tỏ hệ thống điện có dấu hiệu rò rỉ, chập mát hoặc công tơ bị hỏng. Bạn cần liên hệ thợ điện đến kiểm tra ngay.
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