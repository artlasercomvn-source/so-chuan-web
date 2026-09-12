"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH HỆ SỐ & ĐƠN GIÁ (Năm 2026)
// ==========================================
const CONFIG = {
  PRICE_THO: 3800000,     // Giá thi công thô/m2
  PRICE_TRON_GOI: 6200000, // Giá thi công trọn gói/m2
  
  FOUNDATION: {
    'don': { name: 'Móng đơn', coef: 0.3 },
    'bang': { name: 'Móng băng', coef: 0.5 },
    'coc': { name: 'Móng cọc', coef: 0.4 }
  },
  
  ROOF: {
    'ton': { name: 'Mái tôn', coef: 0.3 },
    'betong': { name: 'Mái bê tông cốt thép', coef: 0.5 },
    'ngoi': { name: 'Mái ngói (kèo sắt)', coef: 0.7 }
  }
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ConstructionCostCalculator() {
  const [area, setArea] = useState<string>("80");
  const [floors, setFloors] = useState<string>("3");
  const [foundation, setFoundation] = useState<keyof typeof CONFIG.FOUNDATION>('bang');
  const [roof, setRoof] = useState<keyof typeof CONFIG.ROOF>('betong');

  // --- Smart Memory ---
  useEffect(() => {
    const savedArea = localStorage.getItem('build_area');
    const savedFloors = localStorage.getItem('build_floors');
    const savedFound = localStorage.getItem('build_found');
    const savedRoof = localStorage.getItem('build_roof');
    
    if (savedArea) setArea(savedArea);
    if (savedFloors) setFloors(savedFloors);
    if (savedFound) setFoundation(savedFound as any);
    if (savedRoof) setRoof(savedRoof as any);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation Logic ---
  const result = useMemo(() => {
    const s = parseFloat(area) || 0;
    const f = parseFloat(floors) || 0;

    if (s <= 0 || f <= 0) return null;

    const foundationArea = s * CONFIG.FOUNDATION[foundation].coef;
    const bodyArea = s * f;
    const roofArea = s * CONFIG.ROOF[roof].coef;
    const totalArea = foundationArea + bodyArea + roofArea;

    const costTho = totalArea * CONFIG.PRICE_THO;
    const costTronGoi = totalArea * CONFIG.PRICE_TRON_GOI;

    // Bóc tách cơ cấu chi phí (Ước tính theo tỷ lệ chuẩn ngành xây dựng)
    const materials = costTronGoi * 0.55;  // Vật tư (Gạch, xi măng, thép...)
    const labor = costTronGoi * 0.20;      // Nhân công
    const interior = costTronGoi * 0.15;   // Nội thất cơ bản
    const ironwork = costTronGoi * 0.10;   // Hạng mục cơ khí (Cổng sắt, lan can, cầu thang)

    return { 
      totalArea, 
      costTho, 
      costTronGoi,
      breakdown: { foundationArea, bodyArea, roofArea },
      costStructure: [
        { name: 'Vật liệu xây dựng', value: materials },
        { name: 'Nhân công', value: labor },
        { name: 'Nội thất cơ bản', value: interior },
        { name: 'Cổng, Cửa & Lan can', value: ironwork },
      ]
    };
  }, [area, floors, foundation, roof]);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ Dự Toán Chi Phí Xây Nhà Trọn Gói",
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
          
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
              Trang chủ
            </a>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
              In Dự Toán PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Dự Toán Chi Phí Xây Nhà
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Hệ thống bóc tách khối lượng m2 xây dựng tự động dựa trên loại móng, mái và tính toán ngân sách xây thô, trọn gói chuẩn xác.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[45%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Diện tích đất (m²)</label>
                    <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                      value={area} 
                      onChange={(e) => updateState(setArea, 'build_area', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số tầng</label>
                    <input type="number" min="1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                      value={floors} 
                      onChange={(e) => updateState(setFloors, 'build_floors', e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Loại Móng</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(CONFIG.FOUNDATION).map(([key, data]) => (
                      <label key={key} className={`cursor-pointer p-4 rounded-2xl border text-center transition-all ${foundation === key ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" checked={foundation === key} onChange={() => updateState(setFoundation, 'build_found', key)} className="hidden" />
                        <div className={`font-bold text-sm ${foundation === key ? 'text-blue-700' : 'text-slate-700'}`}>{data.name}</div>
                        <div className="text-xs text-slate-400 mt-1">Hệ số {data.coef * 100}%</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Loại Mái</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(CONFIG.ROOF).map(([key, data]) => (
                      <label key={key} className={`cursor-pointer p-4 rounded-2xl border text-center transition-all ${roof === key ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" checked={roof === key} onChange={() => updateState(setRoof, 'build_roof', key)} className="hidden" />
                        <div className={`font-bold text-sm ${roof === key ? 'text-blue-700' : 'text-slate-700'}`}>{data.name}</div>
                        <div className="text-xs text-slate-400 mt-1">Hệ số {data.coef * 100}%</div>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              
              {result && (
                <>
                  {/* TỔNG QUAN CHI PHÍ */}
                  <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 print:border">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                    
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-4 relative z-10 print:text-slate-600 text-emerald-400">
                      TỔNG MỨC ĐẦU TƯ TRỌN GÓI (CHÌA KHÓA TRAO TAY)
                    </h3>
                    
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 relative z-10 break-words print:text-black text-white">
                      {formatCurrency(result.costTronGoi)} <span className="text-xl md:text-2xl font-bold opacity-60">đ</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-slate-700/50 relative z-10 print:border-slate-200">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Tổng m² xây dựng</div>
                        <div className="text-2xl font-bold text-white print:text-slate-800 break-words">{result.totalArea.toFixed(1)} <span className="text-sm font-normal text-slate-400">m²</span></div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Xây Thô & Nhân Công</div>
                        <div className="text-2xl font-bold text-blue-400 print:text-slate-800 break-words">{formatCurrency(result.costTho)}đ</div>
                      </div>
                    </div>
                  </div>

                  {/* BIỂU ĐỒ CƠ CẤU */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col justify-center print:hidden">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4 text-center">Cơ cấu ngân sách đầu tư dự kiến</h3>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="h-48 w-full md:w-1/2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={result.costStructure} cx="50%" cy="50%" innerRadius={55} outerRadius={80} 
                              paddingAngle={3} dataKey="value" stroke="none"
                            >
                              {result.costStructure.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="drop-shadow-sm hover:opacity-80 outline-none" />
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
                        {result.costStructure.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></span>
                              <span className="font-medium text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-900">{((item.value / result.costTronGoi) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
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
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">Hướng Dẫn Bóc Tách Khối Lượng m² Xây Dựng</h2>
            <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                Các nhà thầu xây dựng hiện nay đều tính giá dựa trên tổng diện tích mét vuông xây dựng thực tế. Tùy thuộc vào biện pháp thi công, phần móng và phần mái sẽ được nhân với các hệ số khác nhau:
              </p>
              <ul className="space-y-4 text-sm md:text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</span>
                  <div><strong>Phần Thân (Các tầng):</strong> Tính 100% diện tích giọt ranh sàn. Nếu nhà 80m2, xây 3 tầng thì phần thân = 240m2.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</span>
                  <div><strong>Phần Móng:</strong> Móng đơn tính 30%, Móng băng tính 50% và Móng cọc tính 40% (Chưa bao gồm chi phí ép cọc bê tông).</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">3</span>
                  <div><strong>Phần Mái:</strong> Tôn lạnh tính 30%, Mái bằng Bê tông cốt thép tính 50%, Mái Thái/Ngói vì kèo thép tính 70% diện tích.</div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp Khi Xây Nhà</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Xây thô và Xây trọn gói khác nhau thế nào?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  <p className="mb-2"><strong>Xây thô:</strong> Nhà thầu cung cấp nhân công và vật tư phần thô (cát, đá, xi măng, gạch, sắt thép, đường ống nước ngầm, đế âm điện). Chủ nhà tự mua vật tư hoàn thiện.</p>
                  <p><strong>Xây trọn gói (Chìa khóa trao tay):</strong> Nhà thầu bao trọn từ A-Z bao gồm cả sơn bả, gạch ốp lát, thiết bị vệ sinh, thiết bị điện chiếu sáng. Không bao gồm nội thất gỗ rời và đồ điện tử rời.</p>
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Cần phân bổ bao nhiêu ngân sách cho Hạng mục sắt mỹ thuật (Cổng, lan can)?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Hạng mục cơ khí (như cổng sắt, hàng rào, cầu thang, lan can ban công mỹ thuật) đóng vai trò quyết định đến diện mạo và sự sang trọng của ngôi nhà. Thông thường, bạn nên trích khoảng <strong>5% - 10% tổng ngân sách</strong> cho hạng mục này. Việc chọn một đơn vị gia công cơ khí mỹ nghệ uy tín ngay từ giai đoạn lên bản vẽ sẽ giúp không gian sống trở nên đẳng cấp hơn rất nhiều.
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