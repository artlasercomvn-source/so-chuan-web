"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CONSTANTS & CONFIGURATION (Tách biệt Hằng số)
// ==========================================
const CONFIG = {
  LUONG_CO_SO: 2530000,
  LUONG_TOI_THIEU_VUNG: { 1: 5310000, 2: 4730000, 3: 4140000, 4: 3700000 },
  GIAM_TRU_BAN_THAN: 11000000,
  GIAM_TRU_NGUOI_PHU_THUOC: 4400000,
  TY_LE: { BHXH: 0.08, BHYT: 0.015, BHTN: 0.01 }
};

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];

// ==========================================
// 2. HELPER FUNCTIONS & CUSTOM HOOK (Tách biệt Logic)
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
// 3. MAIN COMPONENT (Chỉ tập trung vào UI & Data Flow)
// ==========================================
export default function PremiumSalaryCalculator() {
  // --- States ---
  const [income, setIncome] = useState<string>('20000000');
  const [isGross, setIsGross] = useState<boolean>(true);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);
  const [insuranceType, setInsuranceType] = useState<'full' | 'custom'>('full');
  const [customInsurance, setCustomInsurance] = useState<string>('');
  const [dependents, setDependents] = useState<number>(0);

  // --- Core Calculation Logic ---
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

  // --- Chart Data Preparation ---
  const chartData = [
    { name: 'Thực nhận (Net)', value: results.net },
    { name: 'BH Xã hội', value: results.bhxh },
    { name: 'BH Y tế', value: results.bhyt },
    { name: 'BH Thất nghiệp', value: results.bhtn },
    { name: 'Thuế TNCN', value: results.personalTax }
  ].filter(item => item.value > 0); // Chỉ render các phần có giá trị > 0

  const handlePrint = () => window.print();

  // --- Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lương Gross sang Net chuẩn xác 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Lương Gross là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Lương Gross là tổng thu nhập mỗi tháng mà doanh nghiệp trả cho người lao động, bao gồm lương cơ bản và các khoản phụ cấp." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
        {/* Header Tools */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-lg">
            <span>← Quay lại trang chủ</span>
          </a>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
            <span>🖨️ In báo cáo / Lưu PDF</span>
          </button>
        </div>

        {/* Title */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Công Cụ Tính Lương Gross - Net 2026
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Hệ thống chiết tính tự động dựa trên mức lương cơ sở mới nhất (2.530.000đ) theo quy định hiện hành của Chính phủ.
          </p>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-col xl:flex-row gap-8 mb-16">
          
          {/* LEFT: INPUT SECTION */}
          <section className="w-full xl:w-5/12 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 print:border-none print:shadow-none h-fit">
            
            <div className="flex gap-4 mb-8 print:hidden">
              <button onClick={() => setIsGross(true)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${isGross ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>GROSS ➔ NET</button>
              <button onClick={() => setIsGross(false)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${!isGross ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>NET ➔ GROSS</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thu nhập của bạn (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                  value={income} 
                  onChange={(e) => setIncome(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Mức lương đóng bảo hiểm</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <input type="radio" checked={insuranceType === 'full'} onChange={() => setInsuranceType('full')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                    <span className="font-medium text-slate-700">Đóng trên 100% lương chính thức</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <input type="radio" checked={insuranceType === 'custom'} onChange={() => setInsuranceType('custom')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                    <span className="font-medium text-slate-700">Mức đóng tùy chỉnh</span>
                  </label>
                  {insuranceType === 'custom' && (
                    <input type="text" className="p-4 bg-white border border-slate-200 rounded-xl w-full focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                      placeholder="Nhập mức đóng (VNĐ)" 
                      value={customInsurance} 
                      onChange={(e) => setCustomInsurance(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vùng áp dụng</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer" 
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
                  <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                    value={dependents} 
                    onChange={(e) => setDependents(Number(e.target.value))} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: RESULTS & VISUALIZATION */}
          <section className="w-full xl:w-7/12 flex flex-col gap-6">
            
            {/* Block Tính toán Chi tiết */}
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white print:bg-white print:text-black print:border">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Báo Cáo Chiết Tính Lương</h3>
              
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-800 print:border-slate-200">
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">TỔNG LƯƠNG GROSS</div>
                  <div className="text-4xl font-black text-white print:text-black">{formatCurrency(results.gross)}đ</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800 print:border-slate-200">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm xã hội (8%)</span><span className="font-bold text-slate-200 print:text-slate-700">-{formatCurrency(results.bhxh)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm y tế (1.5%)</span><span className="font-bold text-slate-200 print:text-slate-700">-{formatCurrency(results.bhyt)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm thất nghiệp (1%)</span><span className="font-bold text-slate-200 print:text-slate-700">-{formatCurrency(results.bhtn)}đ</span></div>
              </div>
              
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800 print:border-slate-200">
                <span className="text-slate-300 font-bold">Thuế Thu Nhập Cá Nhân</span>
                <span className="font-bold text-rose-400">-{formatCurrency(results.personalTax)}đ</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-900/50 print:bg-slate-100 print:shadow-none print:text-black">
                <div className="text-sm font-bold text-blue-200 mb-1 uppercase tracking-wider print:text-slate-600">Lương Thực Nhận (Net)</div>
                <div className="text-4xl md:text-6xl font-black text-white print:text-black">{formatCurrency(results.net)}đ</div>
              </div>
            </div>

            {/* Block Biểu đồ Phân bổ (New Feature) */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm print:hidden h-80 flex flex-col justify-center items-center">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-4 uppercase self-start">Biểu Đồ Phân Bổ Dòng Tiền</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${formatCurrency(value)}đ`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>
      </div>

      {/* ==========================================
          4. CONTENT SECTION (Tối ưu EEAT & Mobile Layout)
          - Chuyển đổi text dài thành khối ngắn, bullet points.
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Quy định Tính Lương Cập Nhật Mới Nhất 2026</h2>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 text-base leading-relaxed">
              <p>Hệ thống được thiết lập tự động hóa theo các nghị định hiện hành của Chính phủ.</p>
              <ul className="space-y-3 list-disc list-inside text-slate-600">
                <li><strong>Mức lương cơ sở:</strong> 2.530.000 đồng/tháng.</li>
                <li><strong>Giảm trừ gia cảnh bản thân:</strong> 11.000.000 đồng/tháng.</li>
                <li><strong>Giảm trừ người phụ thuộc:</strong> 4.400.000 đồng/tháng/người.</li>
              </ul>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Phân Biệt Lương Gross và Lương Net</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Lương Gross</h3>
                <p className="mb-3 text-slate-600">Lương Gross là tổng thu nhập hàng tháng doanh nghiệp trả cho người lao động.</p>
                <p className="mb-3 text-slate-600">Mức lương này bao gồm lương cơ bản, trợ cấp, phụ cấp và hoa hồng.</p>
                <p className="font-medium text-rose-600">Lưu ý: Chưa bị trừ các khoản bảo hiểm bắt buộc và thuế TNCN.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-emerald-600 mb-4">Lương Net</h3>
                <p className="mb-3 text-slate-600">Lương Net là số tiền thực nhận chuyển về tài khoản cá nhân của bạn.</p>
                <p className="mb-3 text-slate-600">Đây là khoản dư sau khi công ty đã trích lập các quỹ bảo hiểm và đóng thuế hộ.</p>
                <p className="font-medium text-emerald-700">Công thức: Net = Gross - (BHXH + BHYT + BHTN + Thuế TNCN).</p>
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">3. Giải Đáp Thắc Mắc Thường Gặp (Q&A)</h2>
            <div className="space-y-4">
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer shadow-sm">
                <summary className="font-bold text-slate-800 p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  Nhận lương Net hay Gross có lợi hơn?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 mt-2 leading-relaxed">
                  <p className="mb-2">Về mặt tài chính tổng thể, số tiền bạn nhận được là như nhau nếu công ty hạch toán minh bạch.</p>
                  <p>Tuy nhiên, đàm phán <strong>lương Gross</strong> được khuyến khích hơn. Nó giúp bạn chủ động kiểm soát mức đóng bảo hiểm, bảo vệ tối đa quyền lợi hưu trí và thai sản sau này.</p>
                </div>
              </details>
              
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer shadow-sm">
                <summary className="font-bold text-slate-800 p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  Tỷ lệ đóng bảo hiểm bắt buộc năm 2026 là bao nhiêu?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 mt-2 leading-relaxed">
                  <p className="mb-2">Người lao động sẽ trích đóng tổng cộng <strong>10.5%</strong> vào quỹ bảo hiểm từ tiền lương.</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Quỹ Hưu trí tử tuất (BHXH): 8%</li>
                    <li>Quỹ Bảo hiểm y tế (BHYT): 1.5%</li>
                    <li>Quỹ Bảo hiểm thất nghiệp (BHTN): 1%</li>
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