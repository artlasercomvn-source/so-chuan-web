"use client";

import React, { useState, useMemo } from 'react';

const LUONG_CO_SO = 2530000; 
const LUONG_TOI_THIEU_VUNG = { 1: 5310000, 2: 4730000, 3: 4140000, 4: 3700000 };
const GIAM_TRU_BAN_THAN = 11000000; 
const GIAM_TRU_NGUOI_PHU_THUOC = 4400000;

const TY_LE_BHXH = 0.08;
const TY_LE_BHYT = 0.015;
const TY_LE_BHTN = 0.01;

export default function GrossNetCalculator() {
  const [income, setIncome] = useState<string>('20000000');
  const [isGross, setIsGross] = useState<boolean>(true);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);
  const [insuranceType, setInsuranceType] = useState<'full' | 'custom'>('full');
  const [customInsurance, setCustomInsurance] = useState<string>('');
  const [dependents, setDependents] = useState<number>(0);

  const calculateTax = (taxableIncome: number) => {
    if (taxableIncome <= 0) return 0;
    if (taxableIncome <= 5000000) return taxableIncome * 0.05;
    if (taxableIncome <= 10000000) return taxableIncome * 0.1 - 250000;
    if (taxableIncome <= 18000000) return taxableIncome * 0.15 - 750000;
    if (taxableIncome <= 32000000) return taxableIncome * 0.2 - 1650000;
    if (taxableIncome <= 52000000) return taxableIncome * 0.25 - 3250000;
    if (taxableIncome <= 80000000) return taxableIncome * 0.3 - 5850000;
    return taxableIncome * 0.35 - 9850000;
  };

  const results = useMemo(() => {
    const rawIncome = parseInt(income.replace(/,/g, '')) || 0;
    const rawCustomIns = parseInt(customInsurance.replace(/,/g, '')) || 0;
    
    const tranBHXH = LUONG_CO_SO * 20;
    const tranBHTN = LUONG_TOI_THIEU_VUNG[region] * 20;

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
        const bhxh = Math.min(insSalary, tranBHXH) * TY_LE_BHXH;
        const bhyt = Math.min(insSalary, tranBHXH) * TY_LE_BHYT;
        const bhtn = Math.min(insSalary, tranBHTN) * TY_LE_BHTN;
        const totalIns = bhxh + bhyt + bhtn;
        
        const taxable = Math.max(0, estimatedGross - totalIns - GIAM_TRU_BAN_THAN - (dependents * GIAM_TRU_NGUOI_PHU_THUOC));
        const tax = calculateTax(taxable);
        
        const calculatedNet = estimatedGross - totalIns - tax;
        diff = net - calculatedNet;
        estimatedGross += diff;
        loopCount++;
      }
      gross = estimatedGross;
    }

    const insSalary = insuranceType === 'full' ? gross : rawCustomIns;
    const bhxh = Math.min(insSalary, tranBHXH) * TY_LE_BHXH;
    const bhyt = Math.min(insSalary, tranBHXH) * TY_LE_BHYT;
    const bhtn = Math.min(insSalary, tranBHTN) * TY_LE_BHTN;
    const totalIns = bhxh + bhyt + bhtn;

    const taxableIncome = Math.max(0, gross - totalIns - GIAM_TRU_BAN_THAN - (dependents * GIAM_TRU_NGUOI_PHU_THUOC));
    const personalTax = calculateTax(taxableIncome);
    const net = gross - totalIns - personalTax;

    return { gross, net, bhxh, bhyt, bhtn, totalIns, personalTax };
  }, [income, isGross, region, insuranceType, customInsurance, dependents]);

  const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');
  const handlePrint = () => { window.print(); };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lương Gross sang Net chuẩn xác",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <div className="mb-8 flex justify-between items-center print:hidden">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Quay lại trang chủ
          </a>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            In báo cáo / Lưu PDF
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center uppercase tracking-tight">
          Công Cụ Tính Lương Gross - Net
        </h1>
        <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
          Chiết tính tự động dựa trên mức lương cơ sở 2.530.000đ và mức lương tối thiểu vùng mới nhất áp dụng theo Nghị định của Chính phủ.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 print:border-none print:shadow-none">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Thu nhập của bạn (VNĐ)</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={income} onChange={(e) => setIncome(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Mức lương đóng bảo hiểm</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={insuranceType === 'full'} onChange={() => setInsuranceType('full')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Đóng trên 100% lương chính thức</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={insuranceType === 'custom'} onChange={() => setInsuranceType('custom')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Mức đóng khác (VNĐ):</span>
                </label>
                {insuranceType === 'custom' && (
                  <input type="text" className="p-3 bg-slate-50 border border-slate-200 rounded-xl ml-7 w-[calc(100%-1.75rem)] focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Nhập mức lương đóng bảo hiểm..." value={customInsurance} onChange={(e) => setCustomInsurance(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vùng áp dụng</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer" value={region} onChange={(e) => setRegion(Number(e.target.value) as 1|2|3|4)}>
                  <option value={1}>Vùng I</option>
                  <option value={2}>Vùng II</option>
                  <option value={3}>Vùng III</option>
                  <option value={4}>Vùng IV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Người phụ thuộc</label>
                <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex gap-4 print:hidden">
              <button onClick={() => setIsGross(true)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${isGross ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>GROSS ➔ NET</button>
              <button onClick={() => setIsGross(false)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${!isGross ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>NET ➔ GROSS</button>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-8 print:bg-slate-900 print:text-white">
              <h3 className="text-lg font-semibold text-slate-400 mb-6">Báo Cáo Chiết Tính Lương</h3>
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">LƯƠNG GROSS</div>
                  <div className="text-3xl font-black text-white">{formatCurrency(results.gross)}đ</div>
                </div>
              </div>
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm xã hội (8%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhxh)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm y tế (1.5%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhyt)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm thất nghiệp (1%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhtn)}đ</span></div>
                <div className="flex justify-between items-center pt-2"><span className="text-slate-300 font-bold">Tổng bảo hiểm trừ vào lương</span><span className="font-bold text-rose-400">-{formatCurrency(results.totalIns)}đ</span></div>
              </div>
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
                <span className="text-slate-300 font-bold">Thuế Thu Nhập Cá Nhân (TNCN)</span><span className="font-bold text-rose-400">-{formatCurrency(results.personalTax)}đ</span>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="text-sm font-bold text-blue-300 mb-1 uppercase tracking-wider">Lương Thực Nhận (Net)</div>
                <div className="text-4xl md:text-5xl font-black text-white">{formatCurrency(results.net)}đ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG MỞ RỘNG (TẬP TRUNG SEO & TIME ON SITE) */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Lương Gross và Lương Net là gì?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Lương Gross (Lương gộp)</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Là tổng thu nhập mỗi tháng mà doanh nghiệp cam kết trả cho bạn. 
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  Mức lương này <strong className="text-white">chưa bị trừ</strong> các khoản bảo hiểm bắt buộc và Thuế thu nhập cá nhân (TNCN).
                </p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">Lương Net (Lương ròng)</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Là số tiền thực tế bạn nhận được (chuyển khoản về thẻ ATM) vào mỗi kỳ lương.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  Mức lương này <strong className="text-white">đã bị trừ</strong> toàn bộ chi phí bảo hiểm và thuế TNCN theo quy định.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Công thức quy đổi nhanh</h2>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 flex items-center justify-center text-center">
              <div>
                <div className="text-slate-400 text-sm mb-3 uppercase tracking-wider font-bold">Công thức chuẩn</div>
                <div className="text-xl md:text-2xl font-black text-white">
                  Lương Net = Lương Gross - (BHXH + BHYT + BHTN) - Thuế TNCN
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Tỷ lệ trích đóng bảo hiểm bắt buộc</h2>
            <p className="text-slate-400 text-sm mb-4">Căn cứ theo quy định của Luật Bảo hiểm xã hội hiện hành, tỷ lệ trích đóng từ lương của người lao động như sau:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <div className="text-3xl font-black text-blue-400 mb-2">8%</div>
                <div className="text-sm font-bold text-white">Quỹ Hưu trí, Tử tuất</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm xã hội)</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <div className="text-3xl font-black text-emerald-400 mb-2">1.5%</div>
                <div className="text-sm font-bold text-white">Quỹ Khám chữa bệnh</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm y tế)</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <div className="text-3xl font-black text-rose-400 mb-2">1%</div>
                <div className="text-sm font-bold text-white">Quỹ Trợ cấp thất nghiệp</div>
                <div className="text-xs text-slate-500 mt-1">(Bảo hiểm thất nghiệp)</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}