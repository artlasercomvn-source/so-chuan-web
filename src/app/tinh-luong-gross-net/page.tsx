"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ 
// ==========================================
const CONFIG = {
  LUONG_CO_SO: 2530000,
  LUONG_TOI_THIEU_VUNG: { 1: 5310000, 2: 4730000, 3: 4140000, 4: 3700000 },
  GIAM_TRU_BAN_THAN: 11000000,
  GIAM_TRU_NGUOI_PHU_THUOC: 4400000,
  TY_LE: { BHXH: 0.08, BHYT: 0.015, BHTN: 0.01 }
};

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

// ==========================================
// 2. LOGIC TÍNH TOÁN
// ==========================================
const calculateTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 5000000) return taxableIncome * 0.05;
  if (taxableIncome <= 10000000) return taxableIncome * 0.1 - 250000;
  if (taxableIncome <= 18000000) return taxableIncome * 0.15 - 750000;
  if (taxableIncome <= 32000000) return taxableIncome * 0.2 - 1650000;
  if (taxableIncome <= 52000000) return taxableIncome * 0.25 - 3250000;
  if (taxableIncome <= 80000000) return taxableIncome * 0.3 - 5850000;
  return taxableIncome * 0.35 - 9850000;
};

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function GrossNetCalculator() {
  const [income, setIncome] = useState<string>('20000000');
  const [isGross, setIsGross] = useState<boolean>(true);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);
  const [insuranceType, setInsuranceType] = useState<'full' | 'custom'>('full');
  const [customInsurance, setCustomInsurance] = useState<string>('');
  const [dependents, setDependents] = useState<number>(0);

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedIncome = localStorage.getItem('gn_income');
    const savedIsGross = localStorage.getItem('gn_isGross');
    const savedRegion = localStorage.getItem('gn_region');
    const savedInsType = localStorage.getItem('gn_insType');
    const savedCustomIns = localStorage.getItem('gn_customIns');
    const savedDeps = localStorage.getItem('gn_deps');

    if (savedIncome) setIncome(savedIncome);
    if (savedIsGross) setIsGross(savedIsGross === 'true');
    if (savedRegion) setRegion(Number(savedRegion) as 1|2|3|4);
    if (savedInsType) setInsuranceType(savedInsType as 'full'|'custom');
    if (savedCustomIns) setCustomInsurance(savedCustomIns);
    if (savedDeps) setDependents(Number(savedDeps));
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  const results = useMemo(() => {
    const rawIncome = parseInt(income.replace(/,/g, '')) || 0;
    const rawCustomIns = parseInt(customInsurance.replace(/,/g, '')) || 0;
    
    const tranBHXH = CONFIG.LUONG_CO_SO * 20;
    const tranBHTN = CONFIG.LUONG_TOI_THIEU_VUNG[region] * 20;

    let gross = 0;
    
    if (isGross) {
      gross = rawIncome;
    } else {
      let net = rawIncome;
      let estimatedGross = net;
      let loopCount = 0;
      let diff = 1000;
      
      while (Math.abs(diff) > 1 && loopCount < 50) {
        const insSalary = insuranceType === 'full' ? estimatedGross : rawCustomIns;
        const bhxh = Math.min(insSalary, tranBHXH) * CONFIG.TY_LE.BHXH;
        const bhyt = Math.min(insSalary, tranBHXH) * CONFIG.TY_LE.BHYT;
        const bhtn = Math.min(insSalary, tranBHTN) * CONFIG.TY_LE.BHTN;
        const totalIns = bhxh + bhyt + bhtn;
        
        const taxable = Math.max(0, estimatedGross - totalIns - CONFIG.GIAM_TRU_BAN_THAN - (dependents * CONFIG.GIAM_TRU_NGUOI_PHU_THUOC));
        const tax = calculateTax(taxable);
        
        const calculatedNet = estimatedGross - totalIns - tax;
        diff = net - calculatedNet;
        estimatedGross += diff;
        loopCount++;
      }
      gross = estimatedGross;
    }

    const insSalary = insuranceType === 'full' ? gross : rawCustomIns;
    const bhxh = Math.min(insSalary, tranBHXH) * CONFIG.TY_LE.BHXH;
    const bhyt = Math.min(insSalary, tranBHXH) * CONFIG.TY_LE.BHYT;
    const bhtn = Math.min(insSalary, tranBHTN) * CONFIG.TY_LE.BHTN;
    const totalIns = bhxh + bhyt + bhtn;

    const taxableIncome = Math.max(0, gross - totalIns - CONFIG.GIAM_TRU_BAN_THAN - (dependents * CONFIG.GIAM_TRU_NGUOI_PHU_THUOC));
    const personalTax = calculateTax(taxableIncome);
    const net = gross - totalIns - personalTax;

    return { gross, net, bhxh, bhyt, bhtn, totalIns, personalTax };
  }, [income, isGross, region, insuranceType, customInsurance, dependents]);

  const chartData = [
    { name: 'Thực nhận (Net)', value: results.net },
    { name: 'BH Xã hội', value: results.bhxh },
    { name: 'BH Y tế', value: results.bhyt },
    { name: 'BH Thất nghiệp', value: results.bhtn },
    { name: 'Thuế TNCN', value: results.personalTax }
  ].filter(item => item.value > 0);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ quy đổi Lương Gross sang Net chuẩn 2026",
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
              Trang chủ Số Chuẩn
            </a>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Xuất PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Quy Đổi Lương Gross - Net
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Hệ thống chiết tính tự động dựa trên mức lương cơ sở mới nhất (2.530.000đ) và biểu thuế TNCN lũy tiến từng phần.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[45%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 print:border-none print:shadow-none h-fit">
              
              <div className="flex gap-3 md:gap-4 mb-8 print:hidden">
                <button onClick={() => updateState(setIsGross, 'gn_isGross', true)} className={`flex-1 py-3 md:py-4 rounded-xl font-black text-xs md:text-sm transition-all ${isGross ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>GROSS ➔ NET</button>
                <button onClick={() => updateState(setIsGross, 'gn_isGross', false)} className={`flex-1 py-3 md:py-4 rounded-xl font-black text-xs md:text-sm transition-all ${!isGross ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>NET ➔ GROSS</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Thu nhập của bạn (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={income} 
                    onChange={(e) => updateState(setIncome, 'gn_income', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-3">Mức lương đóng bảo hiểm</label>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-2xl transition-colors ${insuranceType === 'full' ? 'bg-blue-50 border-blue-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <input type="radio" checked={insuranceType === 'full'} onChange={() => updateState(setInsuranceType, 'gn_insType', 'full')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                      <span className="font-bold text-slate-700 text-sm">Đóng trên 100% lương thực tế</span>
                    </label>
                    <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-2xl transition-colors ${insuranceType === 'custom' ? 'bg-blue-50 border-blue-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <input type="radio" checked={insuranceType === 'custom'} onChange={() => updateState(setInsuranceType, 'gn_insType', 'custom')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                      <span className="font-bold text-slate-700 text-sm">Mức đóng tùy chỉnh</span>
                    </label>
                    {insuranceType === 'custom' && (
                      <input type="text" className="p-4 bg-white border border-slate-200 rounded-2xl w-full focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner font-bold text-slate-800" 
                        placeholder="Nhập mức đóng (VNĐ)" 
                        value={customInsurance} 
                        onChange={(e) => updateState(setCustomInsurance, 'gn_customIns', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Vùng áp dụng</label>
                    <select className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer appearance-none transition-all" 
                      value={region} 
                      onChange={(e) => updateState(setRegion, 'gn_region', Number(e.target.value))}
                    >
                      <option value={1}>Vùng I</option>
                      <option value={2}>Vùng II</option>
                      <option value={3}>Vùng III</option>
                      <option value={4}>Vùng IV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Người phụ thuộc</label>
                    <input type="number" min="0" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={dependents} 
                      onChange={(e) => updateState(setDependents, 'gn_deps', Number(e.target.value))} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Cột 2: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[55%] flex flex-col gap-6">
              
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-400 mb-4 md:mb-6 uppercase relative z-10">Báo Cáo Chiết Tính Lương</h3>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 pb-6 border-b border-slate-800 print:border-slate-200 relative z-10 gap-2">
                  <div>
                    <div className="text-xs md:text-sm font-medium text-slate-400 mb-1">TỔNG LƯƠNG GROSS</div>
                    <div className="text-2xl md:text-3xl font-black text-white break-words print:text-black">{formatCurrency(results.gross)}đ</div>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4 mb-6 pb-6 border-b border-slate-800 print:border-slate-200 relative z-10">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-medium">Bảo hiểm xã hội (8%)</span>
                    <span className="font-bold text-slate-200 break-words print:text-slate-700">-{formatCurrency(results.bhxh)}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-medium">Bảo hiểm y tế (1.5%)</span>
                    <span className="font-bold text-slate-200 break-words print:text-slate-700">-{formatCurrency(results.bhyt)}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-medium">Bảo hiểm thất nghiệp (1%)</span>
                    <span className="font-bold text-slate-200 break-words print:text-slate-700">-{formatCurrency(results.bhtn)}đ</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6 md:mb-8 pb-6 border-b border-slate-800 print:border-slate-200 relative z-10 text-sm md:text-base">
                  <span className="text-slate-300 font-bold">Thuế Thu Nhập Cá Nhân</span>
                  <span className="font-bold text-rose-400 break-words">-{formatCurrency(results.personalTax)}đ</span>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 md:p-8 shadow-2xl relative z-10 print:bg-slate-100 print:shadow-none print:text-black">
                  <div className="text-xs font-bold text-blue-200 mb-1 md:mb-2 uppercase tracking-wider print:text-slate-600">Lương Thực Nhận (Net)</div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white break-words print:text-black">{formatCurrency(results.net)}đ</div>
                </div>
              </div>

              {results.gross > 0 && (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-8 shadow-sm print:hidden flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="w-full md:w-1/2 h-56 relative">
                    <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-800 mb-2 uppercase text-center absolute w-full top-0">Cơ Cấu Dòng Tiền</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="drop-shadow-sm hover:opacity-80 outline-none" />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center gap-3">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                        <div className="flex-1 text-sm font-medium text-slate-600">{item.name}</div>
                        <div className="text-sm font-bold text-slate-900">{((item.value / results.gross) * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG (Mobile-Friendly & EEAT)
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Định Nghĩa Lương Gross & Net</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">💼</div>
                <h3 className="text-lg md:text-xl font-black text-blue-600 mb-3">Lương Gross</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">Là tổng thu nhập hàng tháng doanh nghiệp cam kết trả cho bạn trên hợp đồng (Bao gồm lương cơ bản, phụ cấp, trợ cấp...).</p>
                <div className="mt-4 p-3 bg-rose-50 rounded-xl text-xs md:text-sm text-rose-700 font-medium border border-rose-100">
                  ⚠️ Khoản này chưa bị trừ các loại chi phí bảo hiểm và Thuế TNCN.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">💰</div>
                <h3 className="text-lg md:text-xl font-black text-emerald-600 mb-3">Lương Net</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">Là số tiền thực tế cuối cùng bạn nhận được (chuyển khoản về thẻ ATM) sau khi công ty đã trích lập các quỹ thay bạn.</p>
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs md:text-sm text-emerald-700 font-bold border border-emerald-100">
                  Công thức: Net = Gross - (Bảo hiểm + Thuế TNCN)
                </div>
              </div>

            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Tỷ Lệ Đóng Bảo Hiểm Bắt Buộc 2026</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 text-center flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-blue-600 mb-2">8%</div>
                <div className="text-sm font-bold text-slate-800">Quỹ Hưu trí, Tử tuất</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm xã hội)</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 text-center flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-emerald-600 mb-2">1.5%</div>
                <div className="text-sm font-bold text-slate-800">Quỹ Khám chữa bệnh</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm y tế)</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 text-center flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-rose-500 mb-2">1%</div>
                <div className="text-sm font-bold text-slate-800">Quỹ Trợ cấp thất nghiệp</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm thất nghiệp)</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
              
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Ký hợp đồng lương Net hay Gross có lợi hơn?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  <p className="mb-2">Về mặt dòng tiền nhận về hàng tháng, số tiền thực nhận là như nhau nếu công ty đóng bảo hiểm đúng quy định.</p>
                  <p>Tuy nhiên, các chuyên gia tài chính luôn khuyên bạn nên <strong>đàm phán lương Gross</strong>. Khi nhận lương Gross, bạn sẽ chủ động nắm rõ công ty có trích nộp bảo hiểm đầy đủ cho mình không, từ đó bảo vệ quyền lợi thai sản và hưu trí sau này.</p>
                </div>
              </details>
              
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Mức giảm trừ gia cảnh hiện tại là bao nhiêu?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  <ul className="space-y-2">
                    <li>▪️ Giảm trừ cho bản thân người nộp thuế: <strong>11.000.000 VNĐ/tháng</strong>.</li>
                    <li>▪️ Giảm trừ cho mỗi người phụ thuộc (con cái, cha mẹ già...): <strong>4.400.000 VNĐ/tháng</strong>.</li>
                  </ul>
                </div>
              </details>

            </div>
          </section>

        </div>
      </article>

    </>
  );
}