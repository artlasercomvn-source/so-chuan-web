"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ==========================================
// 1. TYPES & HẰNG SỐ
// ==========================================
interface SavingsSchedule {
  month: number;
  deposited: number;
  interestEarned: number;
  totalInterest: number;
  balance: number;
}

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function SavingsCalculator() {
  const [initialDeposit, setInitialDeposit] = useState<string>("100000000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("5000000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [months, setMonths] = useState<string>("36");

  useEffect(() => {
    const savedInitial = localStorage.getItem('savings_initial');
    const savedMonthly = localStorage.getItem('savings_monthly');
    const savedRate = localStorage.getItem('savings_rate');
    const savedMonths = localStorage.getItem('savings_months');
    if (savedInitial) setInitialDeposit(savedInitial);
    if (savedMonthly) setMonthlyContribution(savedMonthly);
    if (savedRate) setInterestRate(savedRate);
    if (savedMonths) setMonths(savedMonths);
  }, []);

  const updateValue = (setter: (val: string) => void, storageKey: string, value: string) => {
    setter(value);
    localStorage.setItem(storageKey, value);
  };

  const result = useMemo(() => {
    const principal = parseFloat(initialDeposit.replace(/,/g, "")) || 0;
    const contribution = parseFloat(monthlyContribution.replace(/,/g, "")) || 0;
    const ratePerYear = parseFloat(interestRate) || 0;
    const termMonths = parseInt(months.replace(/,/g, "")) || 0;

    if ((principal === 0 && contribution === 0) || ratePerYear <= 0 || termMonths <= 0) {
      return { totalBalance: 0, totalPrincipal: 0, totalInterest: 0, schedule: [] };
    }

    const ratePerMonth = (ratePerYear / 100) / 12;
    let currentBalance = principal;
    let totalPrincipal = principal;
    let accumulatedInterest = 0;
    const schedule: SavingsSchedule[] = [];

    for (let i = 1; i <= termMonths; i++) {
      if (i > 1) {
        currentBalance += contribution;
        totalPrincipal += contribution;
      }
      const interestThisMonth = currentBalance * ratePerMonth;
      accumulatedInterest += interestThisMonth;
      currentBalance += interestThisMonth;

      schedule.push({
        month: i,
        deposited: totalPrincipal,
        interestEarned: interestThisMonth,
        totalInterest: accumulatedInterest,
        balance: currentBalance
      });
    }

    return { totalBalance: currentBalance, totalPrincipal, totalInterest: accumulatedInterest, schedule };
  }, [initialDeposit, monthlyContribution, interestRate, months]);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Lãi Tiết Kiệm & Lãi Kép Chuẩn Xác",
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
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
              Xuất PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Tính Lãi Tiết Kiệm & Lãi Kép</h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">Phân tích lộ trình tăng trưởng tài sản dài hạn. Tận dụng "Kỳ quan thứ 8 của thế giới" để đạt tự do tài chính sớm nhất.</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền gửi ban đầu (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={initialDeposit} 
                    onChange={(e) => updateValue(setInitialDeposit, 'savings_initial', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Gửi thêm mỗi tháng (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={monthlyContribution} 
                    onChange={(e) => updateValue(setMonthlyContribution, 'savings_monthly', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label>
                    <input type="text" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={months} 
                      onChange={(e) => updateValue(setMonths, 'savings_months', e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                    <input type="text" className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center transition-all" 
                      value={interestRate} 
                      onChange={(e) => { 
                        const val = e.target.value.replace(/[^0-9.]/g, ''); 
                        if (val.split('.').length <= 2) updateValue(setInterestRate, 'savings_rate', val); 
                      }} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-400 mb-4 md:mb-6 uppercase relative z-10">Báo Cáo Tăng Trưởng Tài Sản</h3>
                
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 md:p-8 shadow-2xl shadow-emerald-900/50 mb-6 md:mb-8 relative z-10 print:bg-slate-100 print:shadow-none print:text-black">
                  <div className="text-xs font-bold text-emerald-100 mb-1 md:mb-2 uppercase tracking-wider print:text-slate-600">Tổng Số Dư Cuối Kỳ</div>
                  {/* Sử dụng break-words để số tỷ tỷ không bị tràn trên màn hình nhỏ */}
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight break-words print:text-black">
                    {formatCurrency(result.totalBalance)} <span className="text-xl md:text-2xl font-bold opacity-70">VNĐ</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 relative z-10">
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Tổng vốn gốc đã nộp</div>
                    <div className="text-xl sm:text-2xl font-bold text-white break-words">{formatCurrency(result.totalPrincipal)}đ</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Tổng lãi sinh ra</div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400 break-words">+{formatCurrency(result.totalInterest)}đ</div>
                  </div>
                </div>
              </div>

              {result.schedule.length > 0 && (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-8 shadow-sm print:hidden flex flex-col items-center">
                  <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-800 mb-6 uppercase self-start">Biểu đồ Lãi Kép (Phép màu thời gian)</h3>
                  <div className="w-full h-56 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.schedule} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} tickFormatter={(value) => `T${value}`} axisLine={false} tickLine={false} minTickGap={20} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <Tooltip 
                          formatter={(value: number) => `${formatCurrency(value)}đ`} 
                          labelFormatter={(label) => `Tháng thứ ${label}`}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="balance" name="Tổng tài sản" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                        <Area type="monotone" dataKey="deposited" name="Gốc đã nộp" stroke="#cbd5e1" strokeWidth={2} fillOpacity={1} fill="url(#colorPrincipal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* BẢNG CHI TIẾT FULL WIDTH */}
          {result.schedule.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden mb-16 print:border-none print:shadow-none">
              <div className="px-5 md:px-8 py-5 border-b border-slate-100 bg-slate-50 print:bg-white">
                <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Chi Tiết Dòng Tiền Từng Tháng</h3>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible">
                <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[700px]">
                  <thead className="bg-slate-100 sticky top-0 z-10 print:bg-slate-50">
                    <tr>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b">Kỳ (Tháng)</th>
                      <th className="p-4 md:p-5 font-bold text-slate-600 border-b text-right">Tổng gốc nộp</th>
                      <th className="p-4 md:p-5 font-bold text-emerald-600 border-b text-right">Lãi phát sinh</th>
                      <th className="p-4 md:p-5 font-bold text-emerald-600 border-b text-right">Tổng tiền lãi</th>
                      <th className="p-4 md:p-5 font-black text-teal-700 border-b text-right">Số Dư Tài Khoản</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-teal-50/50 transition-colors">
                        <td className="px-4 md:px-5 py-4 font-bold text-slate-900 bg-slate-50/50">{row.month}</td>
                        <td className="px-4 md:px-5 py-4 font-medium text-slate-600 text-right">{formatCurrency(row.deposited)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-bold text-emerald-500 text-right">+{formatCurrency(row.interestEarned)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-bold text-emerald-600 text-right">{formatCurrency(row.totalInterest)}đ</td>
                        <td className="px-4 md:px-5 py-4 font-black text-teal-700 bg-teal-50/30 text-right">{formatCurrency(row.balance)}đ</td>
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
          (Bỏ bản đồ, tập trung kiến thức tài chính)
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Sức mạnh của Lãi kép (Compound Interest)</h2>
            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded-3xl p-6 md:p-8">
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">Được thiên tài Albert Einstein ví như <strong>"Kỳ quan thứ 8 của thế giới"</strong>, lãi kép là chìa khóa vàng trong đầu tư và tích lũy tài sản.</p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">Bản chất của lãi kép xảy ra khi tiền lãi sinh ra từ số vốn ban đầu được tiếp tục cộng dồn lại vào gốc để sinh lãi cho các chu kỳ tiếp theo (lãi mẹ đẻ lãi con). Thời gian gửi càng dài, sức mạnh của lãi kép càng khủng khiếp.</p>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">3 Yếu tố quyết định tốc độ tăng trưởng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              
              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">⏳</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Thời gian</h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Là yếu tố quan trọng nhất. Bắt đầu tích lũy càng sớm, đường cong tài sản càng dốc đứng.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4">📈</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Lãi suất</h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Chỉ cần tìm được kênh đầu tư chênh lệch 1-2% năm cũng tạo ra sự khác biệt khổng lồ.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl mb-4">💰</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Kỷ luật nộp thêm</h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Gửi thêm một khoản cố định mỗi tháng là bí quyết đẩy nhanh cỗ máy lãi kép hoạt động.</p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu hỏi thường gặp</h2>
            <div className="space-y-3 md:space-y-4">
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Nên gửi tiết kiệm kỳ hạn dài hay kỳ hạn ngắn?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Kỳ hạn dài (6-12 tháng) thường có lãi suất cao hơn, phù hợp với khoản tiền nhàn rỗi chắc chắn không dùng đến. Tuy nhiên, nếu bạn muốn tận dụng triệt để "Lãi kép", bạn có thể chia nhỏ ra gửi kỳ hạn ngắn (1-3 tháng) để tiền lãi nhanh chóng nhập vào gốc.
                </div>
              </details>
              
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Làm sao để chống lại lạm phát?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Lạm phát làm giảm sức mua của đồng tiền. Để tài sản thực sự tăng trưởng, tỷ suất sinh lời từ lãi kép của bạn bắt buộc phải lớn hơn tỷ lệ lạm phát hàng năm.
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