"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

const CHART_COLORS = ['#94a3b8', '#ef4444', '#10b981'];
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

export default function TaxFinalizationCalculator() {
  const [totalIncomeInput, setTotalIncomeInput] = useState<string>("500000000");
  const [taxDeductedInput, setTaxDeductedInput] = useState<string>("35000000");
  const [dependents, setDependents] = useState<string>("0");
  const [dependentMonths, setDependentMonths] = useState<string>("12");

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

  const result = useMemo(() => {
    const totalIncome = parseFloat(totalIncomeInput.replace(/,/g, "")) || 0;
    const taxDeducted = parseFloat(taxDeductedInput.replace(/,/g, "")) || 0;
    const numDependents = parseInt(dependents) || 0;
    const months = parseInt(dependentMonths) || 12;

    if (totalIncome <= 0) return null;

    const personalDeduction = CONFIG.PERSONAL_DEDUCTION * 12;
    const dependentDeduction = CONFIG.DEPENDENT_DEDUCTION * numDependents * months;
    const totalDeduction = personalDeduction + dependentDeduction;
    
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    let finalTax = 0;
    for (const bracket of CONFIG.YEARLY_BRACKETS) {
      if (taxableIncome <= bracket.upTo) {
        finalTax = taxableIncome * bracket.rate - bracket.subtraction;
        break;
      }
    }
    finalTax = Math.max(0, finalTax);

    const difference = taxDeducted - finalTax;
    let status: 'refund' | 'payable' | 'none' = 'none';
    if (difference > 0) status = 'refund';
    else if (difference < 0) status = 'payable';

    return { totalIncome, totalDeduction, taxableIncome, finalTax, difference: Math.abs(difference), status, taxDeducted };
  }, [totalIncomeInput, taxDeductedInput, dependents, dependentMonths]);

  const chartData = result ? [
    { name: 'Mức giảm trừ', value: Math.min(result.totalIncome, result.totalDeduction), color: CHART_COLORS[0] },
    { name: 'Thuế phải nộp', value: result.finalTax, color: CHART_COLORS[1] },
    { name: 'Thu nhập ròng', value: Math.max(0, result.totalIncome - Math.min(result.totalIncome, result.totalDeduction) - result.finalTax), color: CHART_COLORS[2] }
  ].filter(item => item.value > 0) : [];

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Quyết toán thuế TNCN chuẩn xác 2026",
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
              In kết quả
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Quyết Toán Thuế TNCN</h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">Xác định số tiền thuế bạn được <strong className="text-emerald-600">HOÀN LẠI</strong> hoặc phải <strong className="text-rose-500">NỘP THÊM</strong> trong năm tài chính.</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tổng thu nhập chịu thuế (Năm)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    placeholder="VD: 500,000,000"
                    value={totalIncomeInput} 
                    onChange={(e) => updateValue(setTotalIncomeInput, 'tax_total_income', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                  <p className="text-xs text-slate-400 mt-2">*Đã trừ các khoản bảo hiểm bắt buộc.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số thuế đã bị tạm khấu trừ</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-rose-600 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    placeholder="VD: 35,000,000"
                    value={taxDeductedInput} 
                    onChange={(e) => updateValue(setTaxDeductedInput, 'tax_deducted', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                  <p className="text-xs text-slate-400 mt-2">*Xem trên chứng từ khấu trừ thuế công ty cấp.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Người phụ thuộc</label>
                    <input type="number" min="0" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={dependents} 
                      onChange={(e) => updateValue(setDependents, 'tax_dependents', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Số tháng giảm trừ</label>
                    <input type="number" min="1" max="12" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={dependentMonths} 
                      onChange={(e) => updateValue(setDependentMonths, 'tax_dep_months', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              {result !== null && (
                <>
                  <div className={`rounded-[2rem] shadow-xl p-5 md:p-8 border relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 ${
                    result.status === 'refund' ? 'bg-emerald-50 border-emerald-200' : 
                    result.status === 'payable' ? 'bg-rose-50 border-rose-200' : 
                    'bg-slate-100 border-slate-200'
                  }`}>
                    <h3 className={`text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 relative z-10 print:text-slate-600 ${
                      result.status === 'refund' ? 'text-emerald-800' : 
                      result.status === 'payable' ? 'text-rose-800' : 'text-slate-800'
                    }`}>
                      {result.status === 'refund' ? '🎉 SỐ TIỀN THUẾ ĐƯỢC HOÀN LẠI:' : 
                       result.status === 'payable' ? '⚠️ SỐ TIỀN THUẾ PHẢI NỘP THÊM:' : '✅ BẠN ĐÃ NỘP VỪA ĐỦ THUẾ. SỐ DƯ:'}
                    </h3>
                    
                    <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 md:mb-8 relative z-10 break-words print:text-black ${
                      result.status === 'refund' ? 'text-emerald-600' : 
                      result.status === 'payable' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {formatCurrency(result.difference)} <span className="text-xl md:text-2xl font-bold opacity-70">VNĐ</span>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 md:pt-6 border-t relative z-10 print:border-slate-200 ${
                      result.status === 'refund' ? 'border-emerald-200/60' : 
                      result.status === 'payable' ? 'border-rose-200/60' : 'border-slate-300'
                    }`}>
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 ${result.status === 'refund' ? 'text-emerald-700' : result.status === 'payable' ? 'text-rose-700' : 'text-slate-500'}`}>Tổng thuế phải nộp thực tế</div>
                        <div className={`text-xl sm:text-2xl font-bold break-words ${result.status === 'refund' ? 'text-emerald-900' : result.status === 'payable' ? 'text-rose-900' : 'text-slate-800'}`}>{formatCurrency(result.finalTax)}đ</div>
                      </div>
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 ${result.status === 'refund' ? 'text-emerald-700' : result.status === 'payable' ? 'text-rose-700' : 'text-slate-500'}`}>Số thuế công ty đã thu</div>
                        <div className={`text-xl sm:text-2xl font-bold break-words ${result.status === 'refund' ? 'text-emerald-900' : result.status === 'payable' ? 'text-rose-900' : 'text-slate-800'}`}>{formatCurrency(result.taxDeducted)}đ</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col justify-center print:hidden">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4 text-center">Cơ cấu Thu Nhập Cá Nhân</h3>
                      <div className="h-48 md:h-52 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} 
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
                      <div className="mt-4 space-y-2">
                        {chartData.map((item, idx) => (
                          <div key={idx} className="flex items-center text-xs text-slate-600">
                            <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                            <span className="flex-1 truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm flex flex-col print:border-none print:shadow-none">
                      <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Chi tiết Thu nhập & Giảm trừ</h3>
                      </div>
                      <div className="p-2 flex-1 flex flex-col justify-center">
                        <table className="w-full text-xs md:text-sm text-left text-slate-600">
                          <tbody>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3.5 font-medium">Tổng thu nhập</td>
                              <td className="px-3 md:px-4 py-3.5 text-right font-bold text-slate-900 break-words">{formatCurrency(result.totalIncome)} đ</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3.5 font-medium">Giảm trừ bản thân (Năm)</td>
                              <td className="px-3 md:px-4 py-3.5 text-right font-bold text-emerald-600 break-words">-{formatCurrency(CONFIG.PERSONAL_DEDUCTION * 12)} đ</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3.5 font-medium">Giảm trừ người phụ thuộc</td>
                              <td className="px-3 md:px-4 py-3.5 text-right font-bold text-emerald-600 break-words">-{formatCurrency(result.totalDeduction - (CONFIG.PERSONAL_DEDUCTION * 12))} đ</td>
                            </tr>
                            <tr className="bg-slate-100/50">
                              <td className="px-3 md:px-4 py-3.5 font-black text-slate-800 uppercase text-[10px] md:text-xs">Thu nhập tính thuế</td>
                              <td className="px-3 md:px-4 py-3.5 text-right font-black text-blue-600 break-words">{formatCurrency(result.taxableIncome)} đ</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <article className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6 md:mb-8 text-center">Bảng Biểu Thuế Lũy Tiến Từng Phần</h2>
            <p className="text-sm md:text-base text-slate-400 text-center mb-6 md:mb-8 max-w-2xl mx-auto">Số thuế thu nhập cá nhân phải nộp được tính theo phương pháp lũy tiến, chia thành 7 bậc dựa trên mức <strong className="text-white">Thu nhập tính thuế theo năm</strong> của bạn.</p>
            
            <div className="overflow-x-auto bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-xl">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold">
                    <th className="p-3 md:p-4 border-b border-slate-700">Bậc Thuế</th>
                    <th className="p-3 md:p-4 border-b border-slate-700 border-l">Thu nhập tính thuế / Năm (VNĐ)</th>
                    <th className="p-3 md:p-4 border-b border-slate-700 border-l text-center">Thuế suất</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-emerald-400">Bậc 1</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Đến 60.000.000</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">5%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-blue-400">Bậc 2</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Trên 60 tr - 120 tr</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">10%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-indigo-400">Bậc 3</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Trên 120 tr - 216 tr</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">15%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-yellow-400">Bậc 4</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Trên 216 tr - 384 tr</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">20%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-orange-400">Bậc 5</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Trên 384 tr - 624 tr</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">25%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 border-b border-slate-700/50 font-bold text-rose-400">Bậc 6</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l font-mono">Trên 624 tr - 960 tr</td>
                    <td className="p-3 md:p-4 border-b border-slate-700/50 border-l text-center font-bold">30%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-3 md:p-4 font-bold text-rose-600">Bậc 7</td>
                    <td className="p-3 md:p-4 border-l border-slate-700/50 font-mono">Trên 960.000.000</td>
                    <td className="p-3 md:p-4 border-l border-slate-700/50 text-center font-bold">35%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center px-4 break-words">*Thuật toán tự động áp dụng công thức rút gọn để ra kết quả nhanh và chính xác nhất.</p>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-10 text-center">Lộ Trình Tự Hoàn Thuế eTax Mobile</h2>
            <div className="relative border-l-2 border-slate-700 ml-4 md:ml-8 space-y-10 md:space-y-12 pb-4 md:pb-8">
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-700 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">01</div>
                <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2 md:mb-3">Xin chứng từ khấu trừ từ Công ty</h3>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 md:p-5 text-xs md:text-sm text-slate-300 leading-relaxed">
                  Liên hệ bộ phận HR/Kế toán của tất cả công ty bạn đã làm việc trong năm để xin Chứng từ khấu trừ thuế TNCN và Thư xác nhận thu nhập.
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-700 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">02</div>
                <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2 md:mb-3">Tải ứng dụng & Đăng ký tài khoản</h3>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 md:p-5 text-xs md:text-sm text-slate-300 leading-relaxed">
                  Tải app eTax Mobile của Tổng cục Thuế. Đăng ký bằng mã số thuế cá nhân và liên kết tài khoản ngân hàng chính chủ để nhận tiền.
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-900 flex items-center justify-center text-xs md:text-sm font-black text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">03</div>
                <h3 className="text-lg md:text-xl font-bold text-emerald-400 mb-2 md:mb-3">Nộp tờ khai & Nhận tiền hoàn</h3>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 md:p-5 text-xs md:text-sm text-slate-300 leading-relaxed">
                  Truy cập Cổng thông tin Tổng cục Thuế, điền tờ khai 02/QTT-TNCN trực tuyến, đính kèm file ảnh chứng từ và chờ tiền về tài khoản.
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 text-center">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <details className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-800/60 transition-colors">
                <summary className="font-bold text-white p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Có bắt buộc phải đi quyết toán thuế không?
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-700/30 mt-2">
                  Chỉ bắt buộc nếu bạn phải nộp thêm thuế (trên 50.000đ). Nếu kết quả là bạn được Hoàn thuế, việc làm thủ tục là Quyền lợi của bạn (không làm không bị phạt).
                </div>
              </details>

              <details className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-800/60 transition-colors">
                <summary className="font-bold text-white p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Làm 2 công ty có được ủy quyền quyết toán không?
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-700/30 mt-2">
                  Không. Nếu có thu nhập từ 2 nơi trở lên, bạn bắt buộc phải xin chứng từ và tự quyết toán với cơ quan thuế, không thể ủy quyền công ty làm thay.
                </div>
              </details>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}