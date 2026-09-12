"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

// ==========================================
// 1. DỮ LIỆU MÔ PHỎNG & HẰNG SỐ (Cập nhật 2026)
// ==========================================
const CURRENCIES = [
  { code: 'USD', name: 'Đô la Mỹ', buy: 25450, sell: 25520, symbol: '$', trend: [25400, 25420, 25450, 25410, 25480, 25500, 25450] },
  { code: 'EUR', name: 'Euro', buy: 28150, sell: 28350, symbol: '€', trend: [28000, 28100, 28050, 28150, 28200, 28100, 28150] },
  { code: 'JPY', name: 'Yên Nhật', buy: 172.5, sell: 176.5, symbol: '¥', trend: [170, 171, 170.5, 172, 173, 172.5, 172.5] },
  { code: 'KRW', name: 'Won Hàn Quốc', buy: 18.2, sell: 19.5, symbol: '₩', trend: [18, 18.1, 18.0, 18.2, 18.3, 18.1, 18.2] },
  { code: 'GBP', name: 'Bảng Anh', buy: 32600, sell: 32900, symbol: '£', trend: [32500, 32400, 32600, 32700, 32650, 32750, 32600] },
  { code: 'CNY', name: 'Nhân dân tệ', buy: 3520, sell: 3580, symbol: '¥', trend: [3500, 3510, 3505, 3520, 3515, 3530, 3520] },
  { code: 'AUD', name: 'Đô la Úc', buy: 16750, sell: 16950, symbol: 'A$', trend: [16700, 16650, 16750, 16800, 16720, 16780, 16750] },
];

const GOLD_TYPES = [
  { code: 'SJC', name: 'Vàng miếng SJC', buy: 85200000, sell: 87500000, unit: 'Lượng', trend: [84.5, 84.8, 85.0, 84.9, 85.2, 85.5, 85.2] },
  { code: '9999', name: 'Vàng nhẫn 9999', buy: 83500000, sell: 84500000, unit: 'Lượng', trend: [82.5, 82.8, 83.0, 83.2, 83.1, 83.6, 83.5] },
  { code: '18K', name: 'Vàng 18K (75%)', buy: 61200000, sell: 63500000, unit: 'Lượng', trend: [60.5, 60.8, 61.0, 61.2, 61.1, 61.5, 61.2] },
  { code: '14K', name: 'Vàng 14K (58.3%)', buy: 47500000, sell: 49500000, unit: 'Lượng', trend: [47.0, 47.2, 47.5, 47.4, 47.6, 47.8, 47.5] },
];

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. COMPONENT BIỂU ĐỒ MINI (Sparkline)
// ==========================================
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const chartData = data.map((val, i) => ({ index: i, value: val }));
  return (
    <div className="w-20 h-10 md:w-24 md:h-12">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${color})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function ExchangeRateCalculator() {
  const [activeTab, setActiveTab] = useState<'currency' | 'gold'>('currency');
  const [amount, setAmount] = useState<string>("1000");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedGold, setSelectedGold] = useState<string>("SJC");

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedTab = localStorage.getItem('ex_tab');
    const savedAmount = localStorage.getItem('ex_amount');
    const savedCur = localStorage.getItem('ex_cur');
    const savedGold = localStorage.getItem('ex_gold');
    
    if (savedTab) setActiveTab(savedTab as 'currency' | 'gold');
    if (savedAmount) setAmount(savedAmount);
    if (savedCur) setSelectedCurrency(savedCur);
    if (savedGold) setSelectedGold(savedGold);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Calculations ---
  const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  const activeCurData = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const activeGoldData = GOLD_TYPES.find(g => g.code === selectedGold) || GOLD_TYPES[0];

  const convertedValue = activeTab === 'currency' 
    ? numAmount * activeCurData.buy 
    : numAmount * activeGoldData.buy;

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ Quy Đổi Tỷ Giá & Giá Vàng",
        "applicationCategory": "FinanceApplication",
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
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Tỷ giá Live cập nhật
            </div>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Tỷ Giá & Bảng Giá Vàng
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Công cụ quy đổi ngoại tệ, giá vàng SJC trực tuyến. Cập nhật liên tục nhịp đập thị trường tài chính thế giới.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: KHU VỰC QUY ĐỔI (CONVERTER) */}
            <section className="w-full xl:w-[45%] flex flex-col gap-6 h-fit">
              
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8">
                
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                  <button 
                    onClick={() => updateState(setActiveTab, 'ex_tab', 'currency')} 
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'currency' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    💵 Ngoại Tệ
                  </button>
                  <button 
                    onClick={() => updateState(setActiveTab, 'ex_tab', 'gold')} 
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'gold' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    🏆 Giá Vàng
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Số lượng */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Số lượng {activeTab === 'currency' ? 'cần đổi' : '(Lượng)'}
                    </label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-3xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner text-center" 
                      value={amount} 
                      onChange={(e) => updateState(setAmount, 'ex_amount', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                    />
                  </div>

                  {/* Chọn loại tiền/vàng */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {activeTab === 'currency' ? 'Chọn đồng ngoại tệ' : 'Chọn loại vàng'}
                    </label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer appearance-none transition-all"
                      value={activeTab === 'currency' ? selectedCurrency : selectedGold} 
                      onChange={(e) => updateState(activeTab === 'currency' ? setSelectedCurrency : setSelectedGold, activeTab === 'currency' ? 'ex_cur' : 'ex_gold', e.target.value)}
                    >
                      {activeTab === 'currency' 
                        ? CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)
                        : GOLD_TYPES.map(g => <option key={g.code} value={g.code}>{g.code} - {g.name}</option>)
                      }
                    </select>
                  </div>
                </div>

                {/* Kết quả quy đổi */}
                <div className={`mt-8 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ${activeTab === 'currency' ? 'bg-slate-900' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-10 -mr-10 -mt-10"></div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2 relative z-10 text-white/70">
                    Thành tiền (VNĐ)
                  </h3>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight break-words relative z-10">
                    {formatCurrency(convertedValue)} <span className="text-xl md:text-2xl font-bold opacity-60">đ</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60 relative z-10 flex justify-between">
                    <span>*Tính theo tỷ giá mua vào.</span>
                    <span>1 {activeTab === 'currency' ? activeCurData.code : 'Lượng'} = {formatCurrency(activeTab === 'currency' ? activeCurData.buy : activeGoldData.buy)} đ</span>
                  </div>
                </div>

              </div>
            </section>

            {/* CỘT PHẢI: BẢNG GIÁ ĐIỆN TỬ */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden print:border-none print:shadow-none h-full flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Bảng Giá Thị Trường</h3>
                  <span className="text-xs font-medium text-slate-500">Đơn vị: VNĐ</span>
                </div>
                
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm text-left text-slate-600 min-w-[500px]">
                    <thead className="bg-slate-50/50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-500 border-b">Tài sản</th>
                        <th className="px-6 py-4 font-bold text-slate-500 border-b text-right">Mua vào</th>
                        <th className="px-6 py-4 font-bold text-slate-500 border-b text-right">Bán ra</th>
                        <th className="px-6 py-4 font-bold text-slate-500 border-b text-center hidden md:table-cell">Biểu đồ 7 ngày</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Tiêu đề nhóm Tiền tệ */}
                      <tr>
                        <td colSpan={4} className="px-6 py-3 font-black text-xs text-blue-600 bg-blue-50/30 uppercase tracking-wider">Thị trường Ngoại Tệ</td>
                      </tr>
                      {CURRENCIES.map((cur) => (
                        <tr key={cur.code} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => {updateState(setActiveTab, 'ex_tab', 'currency'); updateState(setSelectedCurrency, 'ex_cur', cur.code);}}>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">{cur.symbol}</div>
                              <div>
                                <div className="font-bold text-slate-900">{cur.code}</div>
                                <div className="text-xs text-slate-400">{cur.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right font-bold text-emerald-600">{formatCurrency(cur.buy)}</td>
                          <td className="px-6 py-3.5 text-right font-bold text-rose-500">{formatCurrency(cur.sell)}</td>
                          <td className="px-6 py-2 hidden md:flex justify-center items-center h-full">
                            <Sparkline data={cur.trend} color={cur.trend[6] >= cur.trend[0] ? '#10b981' : '#ef4444'} />
                          </td>
                        </tr>
                      ))}
                      
                      {/* Tiêu đề nhóm Vàng */}
                      <tr>
                        <td colSpan={4} className="px-6 py-3 font-black text-xs text-amber-600 bg-amber-50/30 uppercase tracking-wider border-t">Thị trường Vàng (Chỉ/Lượng)</td>
                      </tr>
                      {GOLD_TYPES.map((gold) => (
                        <tr key={gold.code} className="hover:bg-amber-50/30 transition-colors cursor-pointer" onClick={() => {updateState(setActiveTab, 'ex_tab', 'gold'); updateState(setSelectedGold, 'ex_gold', gold.code);}}>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">✨</div>
                              <div>
                                <div className="font-bold text-slate-900">{gold.code}</div>
                                <div className="text-xs text-slate-400">{gold.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right font-bold text-emerald-600">{formatCurrency(gold.buy)}</td>
                          <td className="px-6 py-3.5 text-right font-bold text-rose-500">{formatCurrency(gold.sell)}</td>
                          <td className="px-6 py-2 hidden md:flex justify-center items-center h-full">
                            <Sparkline data={gold.trend} color={gold.trend[6] >= gold.trend[0] ? '#f59e0b' : '#ef4444'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Phân Biệt Tỷ Giá Mua Vào & Bán Ra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">📥</div>
                <h3 className="text-lg md:text-xl font-black text-emerald-600 mb-3">Tỷ giá MUA VÀO (Bạn Bán)</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Là số tiền VNĐ mà Ngân hàng hoặc Tiệm vàng sẽ trả cho bạn khi bạn mang USD hoặc Vàng đến bán cho họ.
                </p>
                <div className="mt-4 p-3 bg-white rounded-xl text-xs md:text-sm text-slate-700 font-medium border border-slate-200">
                  💡 Bạn có 100 USD muốn đổi ra tiền Việt, hãy nhìn vào cột <strong>Mua vào</strong>.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">📤</div>
                <h3 className="text-lg md:text-xl font-black text-rose-500 mb-3">Tỷ giá BÁN RA (Bạn Mua)</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Là số tiền VNĐ bạn phải bỏ ra để mua được 1 USD hoặc 1 lượng vàng từ Ngân hàng / Tiệm vàng.
                </p>
                <div className="mt-4 p-3 bg-white rounded-xl text-xs md:text-sm text-slate-700 font-medium border border-slate-200">
                  💡 Bạn cần mua 100 USD để đi du lịch, hãy nhìn vào cột <strong>Bán ra</strong>.
                </div>
              </div>

            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 text-center">Kiến Thức Về Vàng Bạn Cần Biết</h2>
            
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-10 md:space-y-12 pb-4 md:pb-8">
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-amber-400 flex items-center justify-center text-xs md:text-sm font-black text-amber-500">01</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Quy ước đơn vị đo lường Vàng</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  <ul className="space-y-2">
                    <li>▪️ <strong>1 Lượng</strong> (Cây vàng) = 10 Chỉ vàng.</li>
                    <li>▪️ <strong>1 Chỉ</strong> = 10 Phân vàng.</li>
                    <li>▪️ <strong>1 Lượng</strong> = 37.5 gram vàng.</li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-amber-400 flex items-center justify-center text-xs md:text-sm font-black text-amber-500">02</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Vàng SJC là gì? Tại sao luôn đắt nhất?</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  Vàng SJC (Saigon Jewelry Company) là thương hiệu vàng miếng được Nhà nước công nhận là <strong>Thương hiệu Vàng quốc gia</strong>. Do nguồn cung vàng miếng SJC được Ngân hàng Nhà nước độc quyền kiểm soát và giới hạn số lượng dập đúc, nên giá vàng SJC thường cao hơn hẳn (đôi khi cao hơn chục triệu đồng/lượng) so với giá vàng nhẫn trơn 9999 dù chất lượng vàng là như nhau (đều là vàng nguyên chất 99.99%).
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Vàng 18K, 14K, 10K là gì? Có nên mua để đầu tư không?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  <p className="mb-2">Chữ "K" (Karat) chỉ tỷ lệ vàng nguyên chất. Vàng 24K là vàng tinh khiết 99.99%.</p>
                  <ul className="space-y-1 ml-2">
                    <li>- Vàng 18K chứa 75% vàng nguyên chất, còn lại là hợp kim.</li>
                    <li>- Vàng 14K chứa 58.3% vàng nguyên chất.</li>
                  </ul>
                  <p className="mt-2 text-rose-600 font-medium">Lưu ý: Vàng 18K, 14K (vàng tây) rất cứng, dễ tạo kiểu nên chủ yếu dùng làm trang sức. KHÔNG NÊN mua để đầu tư tích trữ vì khi bán lại sẽ mất giá rất nhiều do phí gia công và hao hụt.</p>
                </div>
              </details>
              
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Tại sao tỷ giá chợ đen luôn khác tỷ giá Ngân hàng?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Tỷ giá ngân hàng được Ngân hàng Nhà nước kiểm soát biên độ chặt chẽ nhằm ổn định vĩ mô. Tỷ giá chợ đen (ví dụ ở phố Hà Trung) dao động tự do theo quy luật cung cầu thực tế của người dân và doanh nghiệp. Khi nhu cầu mua USD ngoài thị trường tăng vọt (để nhập khẩu, du học...), giá chợ đen sẽ lập tức tăng vọt và cao hơn nhiều so với giá niêm yết tại ngân hàng.
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