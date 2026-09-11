"use client";

import React, { useState, useMemo } from 'react';

// Khai báo hằng số luật mới nhất 2026
const LUONG_CO_SO = 2530000; 
const LUONG_TOI_THIEU_VUNG = {
  1: 5310000,
  2: 4730000,
  3: 4140000,
  4: 3700000,
};
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Công cụ tính lương Gross sang Net 2026",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Số Chuẩn"
    },
    "description": "Hệ thống quy đổi lương Gross sang Net chuẩn xác nhất dựa trên quy định Luật Thuế và Bảo hiểm 2026."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">
          CÔNG CỤ TÍNH LƯƠNG GROSS SANG NET CHUẨN 2026
        </h1>
        <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">
          Cập nhật thuật toán tính thuế và bảo hiểm mới nhất theo mức lương cơ sở 2.530.000đ và mức lương tối thiểu vùng năm 2026.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT NHẬP LIỆU */}
          <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Thu nhập của bạn (VNĐ)</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                value={income}
                onChange={(e) => setIncome(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
              />
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
                  <input 
                    type="text" 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl ml-7 w-[calc(100%-1.75rem)] focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Nhập mức lương đóng bảo hiểm..."
                    value={customInsurance}
                    onChange={(e) => setCustomInsurance(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vùng áp dụng</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                  value={region}
                  onChange={(e) => setRegion(Number(e.target.value) as 1|2|3|4)}
                >
                  <option value={1}>Vùng I</option>
                  <option value={2}>Vùng II</option>
                  <option value={3}>Vùng III</option>
                  <option value={4}>Vùng IV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Người phụ thuộc</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsGross(true)}
                className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${isGross ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                GROSS ➔ NET
              </button>
              <button 
                onClick={() => setIsGross(false)}
                className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${!isGross ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                NET ➔ GROSS
              </button>
            </div>
          </div>

          {/* CỘT KẾT QUẢ BÁO CÁO */}
          <div className="w-full lg:w-1/2">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-8">
              <h3 className="text-lg font-semibold text-slate-400 mb-6">Báo Cáo Chiết Tính Lương</h3>
              
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">LƯƠNG GROSS</div>
                  <div className="text-3xl font-black text-white">{formatCurrency(results.gross)}đ</div>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Bảo hiểm xã hội (8%)</span>
                  <span className="font-bold text-slate-200">-{formatCurrency(results.bhxh)}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Bảo hiểm y tế (1.5%)</span>
                  <span className="font-bold text-slate-200">-{formatCurrency(results.bhyt)}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Bảo hiểm thất nghiệp (1%)</span>
                  <span className="font-bold text-slate-200">-{formatCurrency(results.bhtn)}đ</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300 font-bold">Tổng bảo hiểm trừ vào lương</span>
                  <span className="font-bold text-rose-400">-{formatCurrency(results.totalIns)}đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
                <span className="text-slate-300 font-bold">Thuế Thu Nhập Cá Nhân (TNCN)</span>
                <span className="font-bold text-rose-400">-{formatCurrency(results.personalTax)}đ</span>
              </div>

              <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="text-sm font-bold text-blue-300 mb-1 uppercase tracking-wider">Lương Thực Nhận (Net)</div>
                <div className="text-4xl md:text-5xl font-black text-white">{formatCurrency(results.net)}đ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}