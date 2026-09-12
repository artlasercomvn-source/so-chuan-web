"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. TYPES & CẤU HÌNH HẰNG SỐ
// ==========================================
type CalculationMethod = 'fixed' | 'declining';

interface PaymentSchedule {
  month: number;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}

const CHART_COLORS = ['#3b82f6', '#f43f5e']; // Xanh (Gốc) - Đỏ (Lãi)

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function LoanCalculator() {
  // --- States ---
  const [amount, setAmount] = useState<string>('1000000000');
  const [rate, setRate] = useState<string>('10.5');
  const [months, setMonths] = useState<string>('12');
  const [method, setMethod] = useState<CalculationMethod>('declining');

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedAmount = localStorage.getItem('loan_amount');
    const savedRate = localStorage.getItem('loan_rate');
    const savedMonths = localStorage.getItem('loan_months');
    const savedMethod = localStorage.getItem('loan_method');
    if (savedAmount) setAmount(savedAmount);
    if (savedRate) setRate(savedRate);
    if (savedMonths) setMonths(savedMonths);
    if (savedMethod) setMethod(savedMethod as CalculationMethod);
  }, []);

  const updateValue = (setter: (val: any) => void, storageKey: string, value: any) => {
    setter(value);
    localStorage.setItem(storageKey, value);
  };

  // --- Core Calculation Logic ---
  const { summary, schedule } = useMemo(() => {
    const principal = parseInt(amount.replace(/,/g, '')) || 0;
    const interestRate = parseFloat(rate) || 0;
    const term = parseInt(months) || 0;
    
    let schedule: PaymentSchedule[] = [];
    let totalInterest = 0;

    if (principal > 0 && interestRate > 0 && term > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPrincipal = principal / term;
      let currentPrincipal = principal;

      for (let i = 1; i <= term; i++) {
        const monthlyInterest = method === 'fixed' 
          ? (principal * monthlyRate) 
          : (currentPrincipal * monthlyRate);
          
        const totalPayment = monthlyPrincipal + monthlyInterest;
        totalInterest += monthlyInterest;
        
        schedule.push({ 
          month: i, 
          remainingPrincipal: Math.max(0, currentPrincipal), 
          principalPayment: monthlyPrincipal, 
          interestPayment: monthlyInterest, 
          totalPayment: totalPayment 
        });
        
        currentPrincipal -= monthlyPrincipal;
      }
    }
    return { 
      summary: { 
        totalPrincipal: principal, 
        totalInterest: totalInterest, 
        totalAmount: principal + totalInterest 
      }, 
      schedule 
    };
  }, [amount, rate, months, method]);

  // --- Chart Data ---
  const chartData = [
    { name: 'Tổng tiền gốc', value: summary.totalPrincipal },
    { name: 'Tổng tiền lãi', value: summary.totalInterest }
  ].filter(item => item.value > 0);

  const handlePrint = () => window.print();

  // --- Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lãi suất vay ngân hàng Chuẩn Xác 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Dư nợ giảm dần là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Là phương pháp tính tiền lãi dựa trên số tiền thực tế bạn còn nợ ngân hàng. Sau mỗi tháng trả bớt gốc, tiền lãi tháng sau sẽ thấp hơn tháng trước." }
          },
          {
            "@type": "Question",
            "name": "Dư nợ ban đầu là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Tiền lãi mỗi tháng đều bằng nhau và được tính dựa trên toàn bộ số tiền gốc vay từ ban đầu, không quan tâm đến việc bạn đã trả bớt gốc bao nhiêu." }
          }
        ]
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
              Trang chủ Số Chuẩn
            </a>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
              Xuất PDF Lịch Trả Nợ
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Tính Lãi Vay Ngân Hàng</h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">Xuất bản chi tiết lịch trả nợ hàng tháng giúp bạn kiểm soát dòng tiền và hoạch định kế hoạch mua nhà, mua xe dễ dàng.</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền vay (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={amount} 
                    onChange={(e) => updateValue(setAmount, 'loan_amount', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label>
                    <input type="text" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={months} 
                      onChange={(e) => updateValue(setMonths, 'loan_months', e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                    <input type="text" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={rate} 
                      onChange={(e) => { 
                        const val = e.target.value.replace(/[^0-9.]/g, ''); 
                        if (val.split('.').length <= 2) updateValue(setRate, 'loan_rate', val); 
                      }} 
                    />
                  </div>
                </div>
                
                <div className="pt-2 print:hidden">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Phương pháp tính lãi</label>
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-2xl border transition-all ${method === 'declining' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" checked={method === 'declining'} onChange={() => updateValue(setMethod, 'loan_method', 'declining')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Trả trên dư nợ giảm dần</div>
                        <div className="text-xs text-slate-500 mt-0.5">Tiền lãi giảm dần theo từng tháng</div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-2xl border transition-all ${method === 'fixed' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" checked={method === 'fixed'} onChange={() => updateValue(setMethod, 'loan_method', 'fixed')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Trả trên dư nợ ban đầu</div>
                        <div className="text-xs text-slate-500 mt-0.5">Tiền lãi cố định mỗi tháng</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ TÓM TẮT & BIỂU ĐỒ */}
            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-400 mb-4 md:mb-6 uppercase relative z-10">Tóm Tắt Khoản Vay</h3>
                
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 md:p-8 shadow-2xl mb-6 md:mb-8 relative z-10 print:bg-slate-100 print:shadow-none print:text-black">
                  <div className="text-xs font-bold text-blue-200 mb-1 md:mb-2 uppercase tracking-wider print:text-slate-600">Tổng Gốc + Lãi phải trả</div>
                  {/* Sử dụng break-words để chống tràn trên điện thoại */}
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight break-words print:text-black">
                    {formatCurrency(summary.totalAmount)} <span className="text-xl md:text-2xl font-bold opacity-70">VNĐ</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 relative z-10">
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Tổng tiền gốc</div>
                    <div className="text-xl sm:text-2xl font-bold text-white break-words print:text-black">{formatCurrency(summary.totalPrincipal)}đ</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Tổng lãi phát sinh</div>
                    <div className="text-xl sm:text-2xl font-bold text-rose-400 break-words">+{formatCurrency(summary.totalInterest)}đ</div>
                  </div>
                </div>
              </div>

              {/* Biểu đồ Donut */}
              {summary.totalPrincipal > 0 && (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-8 shadow-sm print:hidden flex-1 min-h-[280px] flex flex-col items-center justify-center">
                  <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-800 mb-4 uppercase self-start">Tỷ trọng Gốc / Lãi</h3>
                  <div className="w-full h-full flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/2 h-52 md:h-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                        <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 font-medium">Gốc vay</div>
                          <div className="font-black text-slate-800 text-lg">{((summary.totalPrincipal / summary.totalAmount) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-rose-50/50 p-4 rounded-2xl">
                        <div className="w-4 h-4 rounded-full bg-rose-500 shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 font-medium">Lãi phải trả</div>
                          <div className="font-black text-slate-800 text-lg">{((summary.totalInterest / summary.totalAmount) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* FULL WIDTH TABLE */}
          {schedule.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden mb-16 print:border-none print:shadow-none">
              <div className="px-5 md:px-8 py-5 border-b border-slate-100 bg-slate-50 print:bg-white">
                <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Chi Tiết Lịch Trả Nợ</h3>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible">
                <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[700px]">
                  <thead className="bg-slate-100 sticky top-0 z-10 print:bg-slate-50">
                    <tr>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b">Kỳ (Tháng)</th>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b">Dư nợ đầu kỳ</th>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b">Gốc phải trả</th>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b">Lãi phải trả</th>
                      <th className="p-4 md:p-5 font-black text-blue-700 border-b">Tổng thanh toán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 md:px-5 py-4 font-bold text-slate-900 bg-slate-50/50">{row.month}</td>
                        <td className="px-4 md:px-5 py-4 font-medium text-slate-600">{formatCurrency(row.remainingPrincipal)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-medium text-slate-700">{formatCurrency(row.principalPayment)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-bold text-rose-500">{formatCurrency(row.interestPayment)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-black text-blue-700 bg-blue-50/30">{formatCurrency(row.totalPayment)}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TIME ON SITE
          (Bỏ bản đồ/hotline, tập trung lưu giữ người dùng)
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Phân Biệt Phương Pháp Tính Lãi Vay</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">⚖️</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Tính theo Dư nợ ban đầu</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Tiền lãi mỗi tháng đều <strong>bằng nhau</strong> và được tính dựa trên toàn bộ số tiền gốc vay từ ban đầu, không quan tâm đến việc bạn đã trả bớt gốc bao nhiêu.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-500">
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Mỗi tháng trả số tiền giống hệt nhau.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Dễ nhớ, dễ quản lý chi tiêu.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Thường áp dụng cho vay tiêu dùng, vay tín chấp.</span></li>
                </ul>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">📉</div>
                <h3 className="text-lg md:text-xl font-black text-blue-600 mb-3">Tính theo Dư nợ giảm dần</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Tiền lãi được tính dựa trên <strong>số tiền thực tế bạn còn nợ</strong>. Vì mỗi tháng bạn đã trả bớt một phần gốc, nên tiền lãi các tháng sau sẽ ít dần đi.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-500">
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Tháng đầu trả nhiều, các tháng sau nhẹ gánh dần.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Tổng tiền lãi phải trả thực tế thấp hơn.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Áp dụng bắt buộc cho vay mua nhà, mua ô tô.</span></li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 text-center">Lộ Trình Vay Vốn Ngân Hàng</h2>
            
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-10 md:space-y-12 pb-4 md:pb-8">
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-200 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">01</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Chuẩn bị hồ sơ pháp lý & Thu nhập</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>Pháp lý:</strong> CCCD gắn chip, Giấy xác nhận tình trạng hôn nhân/Đăng ký kết hôn.</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>Thu nhập:</strong> Hợp đồng lao động, Sao kê lương 3-6 tháng gần nhất.</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>Mục đích vay:</strong> Hợp đồng đặt cọc mua bán nhà/đất/ô tô.</span></li>
                  </ul>
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-200 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">02</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Thẩm định tài sản & Lịch sử tín dụng (CIC)</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  Ngân hàng sẽ tra cứu lịch sử tín dụng CIC của bạn xem có phát sinh nợ xấu hay không. Đồng thời, cử chuyên viên định giá độc lập để xác định giá trị tài sản bạn định thế chấp.
                </div>
              </div>
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-white flex items-center justify-center text-xs md:text-sm font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">03</div>
                <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2 md:mb-3">Ký hợp đồng công chứng & Giải ngân</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-700 leading-relaxed shadow-sm">
                  Hai bên ra phòng công chứng ký hợp đồng thế chấp. Ngân hàng tiến hành đăng ký giao dịch bảo đảm (phong tỏa tài sản) và giải ngân tiền thẳng cho bên bán hoặc vào tài khoản của bạn.
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Công thức tính tiền gốc hàng tháng như thế nào?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  <div className="font-mono bg-white p-3 border border-slate-200 rounded-lg text-blue-600 font-bold break-words">
                    Gốc hàng tháng = Tổng số tiền vay / Tổng số tháng vay
                  </div>
                  <p className="mt-2 text-xs md:text-sm">Ví dụ: Vay 1 tỷ trong 100 tháng. Tiền gốc mỗi tháng phải trả cố định là 10 triệu đồng.</p>
                </div>
              </details>
              
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Lãi suất ưu đãi năm đầu là gì? Có nên vay không?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Các ngân hàng thường áp dụng mức lãi suất rất thấp (6-8%/năm) cho 1-2 năm đầu tiên để thu hút khách. Sau thời gian này, lãi suất sẽ <strong>thả nổi</strong> (bằng Lãi suất cơ sở + Biên độ 3-4%), thường rơi vào khoảng 10.5 - 12.5%/năm. Cần dùng công cụ của Số Chuẩn tính toán kỹ khả năng tài chính cho các năm thả nổi.
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