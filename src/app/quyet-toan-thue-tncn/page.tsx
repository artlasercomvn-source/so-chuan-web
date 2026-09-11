"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ (Quy định Thuế)
// ==========================================
const CONFIG = {
  PERSONAL_DEDUCTION: 11000000, 
  DEPENDENT_DEDUCTION: 4400000,
  YEARLY_BRACKETS: [
    { upTo: 60000000, rate: 0.05, subtraction: 0 },
    { upTo: 120000000, rate: 0.10, subtraction: 3000000 },
    { upTo: 216000000, rate: 0.15, subtraction: 9000000 },
    { upTo: 384000000, rate: 0.20, subtraction: 19800000 },
    { upTo: 624000000, rate: 0.25, subtraction: 39000000 },
    { upTo: 960000000, rate: 0.30, subtraction: 70200000 },
    { upTo: Infinity, rate: 0.35, subtraction: 118200000 },
  ]
};

const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981'];

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function TaxFinalizationCalculator() {
  // --- Quản lý State ---
  const [totalIncomeInput, setTotalIncomeInput] = useState<string>("500000000");
  const [taxDeductedInput, setTaxDeductedInput] = useState<string>("35000000");
  const [dependents, setDependents] = useState<string>("0");
  const [dependentMonths, setDependentMonths] = useState<string>("12");

  // --- Bộ nhớ Thông minh (LocalStorage) ---
  useEffect(() => {
    const savedIncome = localStorage.getItem('tax_total_income');
    const savedDeducted = localStorage.getItem('tax_deducted');
    const savedDeps = localStorage.getItem('tax_dependents');
    const savedMonths = localStorage.getItem('tax_dep_months');
    if (savedIncome) setTotalIncomeInput(savedIncome);
    if (savedDeducted) setTaxDeductedInput(savedDeducted);
    if (savedDeps) setDependents(savedDeps);
    if (savedMonths) setDependentMonths(savedMonths);
  }, []);

  const updateValue = (setter: (val: string) => void, storageKey: string, value: string) => {
    setter(value);
    localStorage.setItem(storageKey, value);
  };

  // --- Thuật toán Quyết Toán (Real-time) ---
  const result = useMemo(() => {
    const totalIncome = parseFloat(totalIncomeInput.replace(/,/g, "")) || 0;
    const taxDeducted = parseFloat(taxDeductedInput.replace(/,/g, "")) || 0;
    const numDependents = parseInt(dependents) || 0;
    const months = parseInt(dependentMonths) || 12;

    if (totalIncome <= 0) return null;

    // Tính tổng giảm trừ
    const personalDeduction = CONFIG.PERSONAL_DEDUCTION * 12;
    const dependentDeduction = CONFIG.DEPENDENT_DEDUCTION * numDependents * months;
    const totalDeduction = personalDeduction + dependentDeduction;
    
    // Thu nhập tính thuế
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    // Tính thuế phải nộp theo biểu thuế lũy tiến
    let finalTax = 0;
    for (const bracket of CONFIG.YEARLY_BRACKETS) {
      if (taxableIncome <= bracket.upTo) {
        finalTax = taxableIncome * bracket.rate - bracket.subtraction;
        break;
      }
    }
    finalTax = Math.max(0, finalTax);

    // Xác định trạng thái (Hoàn / Truy thu)
    const difference = taxDeducted - finalTax;
    let status: 'refund' | 'payable' | 'none' = 'none';
    if (difference > 0) status = 'refund';
    else if (difference < 0) status = 'payable';

    return { totalIncome, totalDeduction, taxableIncome, finalTax, difference: Math.abs(difference), status };
  }, [totalIncomeInput, taxDeductedInput, dependents, dependentMonths]);

  // --- Chart Data ---
  const chartData = result ? [
    { name: 'Mức giảm trừ', value: Math.min(result.totalIncome, result.totalDeduction), color: CHART_COLORS[0] },
    { name: 'Thuế phải nộp', value: result.finalTax, color: CHART_COLORS[1] },
    { name: 'Thu nhập ròng', value: Math.max(0, result.totalIncome - Math.min(result.totalIncome, result.totalDeduction) - result.finalTax), color: CHART_COLORS[2] }
  ].filter(item => item.value > 0) : [];

  const handlePrint = () => window.print();

  // --- Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Quyết toán thuế TNCN 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Quyết toán thuế TNCN là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Là việc xác định số tiền thuế TNCN thực tế mà cá nhân phải nộp trong 1 năm dương lịch. Dựa vào đó để biết số tiền thuế nộp thừa được hoàn lại hoặc số thuế còn thiếu phải nộp thêm." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
        
        {/* NAV & HEADER */}
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

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Quyết Toán Thuế TNCN</h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Xác định chính xác số tiền thuế bạn được Hoàn lại (từ Cục Thuế) hoặc Truy thu phải nộp thêm trong năm tài chính.</p>
        </header>

        {/* KHU VỰC TÍNH TOÁN (2 CỘT) */}
        <div className="flex flex-col xl:flex-row gap-8 mb-16">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <section className="w-full xl:w-5/12 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit print:border-none print:shadow-none">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tổng thu nhập chịu thuế trong năm (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                  value={totalIncomeInput} 
                  onChange={(e) => updateValue(setTotalIncomeInput, 'tax_total_income', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tổng số thuế đã tạm nộp/khấu trừ (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                  value={taxDeductedInput} 
                  onChange={(e) => updateValue(setTaxDeductedInput, 'tax_deducted', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số người phụ thuộc</label>
                  <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                    value={dependents} 
                    onChange={(e) => updateValue(setDependents, 'tax_dependents', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số tháng giảm trừ</label>
                  <input type="number" min="1" max="12" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                    value={dependentMonths} 
                    onChange={(e) => updateValue(setDependentMonths, 'tax_dep_months', e.target.value)} 
                  />
                </div>
              </div>

            </div>
          </section>

          {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
          <section className="w-full xl:w-7/12 flex flex-col gap-6">
            
            {result !== null && (
              <>
                {/* Box Kết Quả Thông Minh */}
                <div className={`rounded-3xl shadow-xl p-6 md:p-8 border print:bg-white print:text-black print:border-slate-200 ${
                  result.status === 'refund' ? 'bg-emerald-50 border-emerald-200/60' : 
                  result.status === 'payable' ? 'bg-rose-50 border-rose-200/60' : 
                  'bg-slate-50 border-slate-200/60'
                }`}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 print:text-slate-600 ${
                    result.status === 'refund' ? 'text-emerald-800' : 
                    result.status === 'payable' ? 'text-rose-800' : 'text-slate-800'
                  }`}>
                    {result.status === 'refund' ? 'Số tiền thuế BẠN ĐƯỢC HOÀN LẠI' : 
                     result.status === 'payable' ? 'Số tiền thuế BẠN PHẢI NỘP THÊM' : 'Bạn đã nộp ĐỦ THUẾ'}
                  </h3>
                  
                  <div className={`text-4xl md:text-5xl font-black tracking-tight mb-8 print:text-black ${
                    result.status === 'refund' ? 'text-emerald-600' : 
                    result.status === 'payable' ? 'text-rose-600' : 'text-slate-600'
                  }`}>
                    {formatCurrency(result.difference)} <span className="text-2xl font-bold opacity-70">VNĐ</span>
                  </div>

                  <div className={`grid grid-cols-2 gap-6 pt-6 border-t print:border-slate-200 ${
                    result.status === 'refund' ? 'border-emerald-200' : 
                    result.status === 'payable' ? 'border-rose-200' : 'border-slate-200'
                  }`}>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Thu nhập tính thuế</div>
                      <div className="text-xl font-bold">{formatCurrency(result.taxableIncome)}đ</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Tổng thuế phải nộp (Năm)</div>
                      <div className="text-xl font-bold">{formatCurrency(result.finalTax)}đ</div>
                    </div>
                  </div>
                </div>

                {/* Box Biểu Đồ */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm print:hidden h-72 flex flex-col items-center">
                  <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-2 uppercase self-start">Cơ cấu thu nhập cá nhân</h3>
                  <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </section>

        </div>
      </main>

      {/* ==========================================
          4. KHU VỰC NỘI DUNG SEO (Tối ưu EEAT)
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Quyết toán thuế TNCN là gì?</h2>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
              <p className="text-slate-600 leading-relaxed">Thuế thu nhập cá nhân (TNCN) là loại thuế tính theo năm nhưng thường được công ty khấu trừ (tạm thu) theo từng tháng.</p>
              <p className="text-slate-600 leading-relaxed">Cuối năm, Cơ quan Thuế sẽ gom toàn bộ thu nhập của bạn lại và tính toán lại theo biểu thuế lũy tiến, đồng thời áp dụng các mức giảm trừ gia cảnh để ra số thuế chính xác bạn phải nộp.</p>
              <p className="text-slate-600 leading-relaxed"><strong>Kết quả:</strong> Nếu số tiền công ty đã tạm thu từng tháng LỚN HƠN số thuế phải nộp thực tế, bạn sẽ được Nhà nước <strong>Hoàn lại tiền thuế</strong>. Ngược lại, bạn sẽ phải nộp truy thu phần còn thiếu.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Hồ sơ chuẩn bị Hoàn Thuế nhanh nhất</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2 hover:border-blue-200 transition-colors">
                <span className="text-3xl">📄</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Chứng từ khấu trừ thuế TNCN</h3>
                <p className="text-slate-600 leading-relaxed">Giấy này do bộ phận Kế toán của công ty cấp (nơi bạn đã làm việc trong năm).</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2 hover:border-blue-200 transition-colors">
                <span className="text-3xl">📝</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Thư xác nhận thu nhập</h3>
                <p className="text-slate-600 leading-relaxed">Cũng do công ty cấp, thể hiện tổng thu nhập bạn đã nhận trong năm tài chính.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2 hover:border-blue-200 transition-colors">
                <span className="text-3xl">👶</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Hồ sơ giảm trừ người phụ thuộc</h3>
                <p className="text-slate-600 leading-relaxed">Giấy khai sinh của con hoặc CCCD của bố mẹ già (đã đăng ký mã số thuế người phụ thuộc).</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2 hover:border-blue-200 transition-colors">
                <span className="text-3xl">📱</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Tài khoản eTax Mobile</h3>
                <p className="text-slate-600 leading-relaxed">Cài đặt ứng dụng eTax Mobile của Tổng cục Thuế để làm thủ tục online 100% không cần ra chi cục.</p>
              </div>

            </div>
          </section>

        </div>
      </article>
    </>
  );
}