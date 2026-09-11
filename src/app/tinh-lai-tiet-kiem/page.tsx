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
  // --- Quản lý State ---
  const [initialDeposit, setInitialDeposit] = useState<string>("100000000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("5000000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [months, setMonths] = useState<string>("36");

  // --- Tính năng Bộ nhớ Thông minh (Khôi phục dữ liệu phiên trước) ---
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

  // --- Thuật toán Lãi kép (Tính toán Real-time) ---
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

  // --- Cấu trúc dữ liệu JSON-LD (SEO) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Lãi Gửi Tiết Kiệm & Lãi Kép 2026",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Lãi kép là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Lãi kép xảy ra khi tiền lãi sinh ra từ số vốn ban đầu được cộng dồn lại vào gốc để tiếp tục sinh lãi cho các chu kỳ tiếp theo." }
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
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Tính Lãi Tiết Kiệm & Lãi Kép</h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Phân tích lộ trình tăng trưởng tài sản dài hạn. Tận dụng "Kỳ quan thứ 8 của thế giới" để đạt tự do tài chính.</p>
        </header>

        {/* KHU VỰC TÍNH TOÁN (2 CỘT) */}
        <div className="flex flex-col xl:flex-row gap-8 mb-16">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <section className="w-full xl:w-5/12 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit print:border-none print:shadow-none">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền gửi ban đầu (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                  value={initialDeposit} 
                  onChange={(e) => updateValue(setInitialDeposit, 'savings_initial', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Gửi thêm mỗi tháng (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                  value={monthlyContribution} 
                  onChange={(e) => updateValue(setMonthlyContribution, 'savings_monthly', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                    value={months} 
                    onChange={(e) => updateValue(setMonths, 'savings_months', e.target.value.replace(/\D/g, ''))} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
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

          {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ TRỰC QUAN */}
          <section className="w-full xl:w-7/12 flex flex-col gap-6">
            
            {/* Box Tổng Tài Sản */}
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white print:bg-white print:text-black print:border">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Báo Cáo Tăng Trưởng Tài Sản</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-800 print:border-slate-200">
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider print:text-slate-500">Tổng gốc đã nộp</div>
                  <div className="text-2xl font-bold text-white print:text-black">{formatCurrency(result.totalPrincipal)}đ</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider print:text-slate-500">Tổng lãi sinh ra</div>
                  <div className="text-2xl font-bold text-emerald-400">+{formatCurrency(result.totalInterest)}đ</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-900/50 print:bg-slate-100 print:shadow-none print:text-black">
                <div className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider print:text-slate-600">Tổng Số Dư Cuối Kỳ</div>
                <div className="text-4xl md:text-5xl font-black text-white print:text-black">{formatCurrency(result.totalBalance)}đ</div>
              </div>
            </div>

            {/* Area Chart: Biểu đồ tăng trưởng */}
            {result.schedule.length > 0 && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm print:hidden flex flex-col items-center">
                <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase self-start">Biểu đồ Lãi Kép</h3>
                <div className="w-full h-72">
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
                      <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `T${value}`} axisLine={false} tickLine={false} />
                      <YAxis hide domain={['auto', 'auto']} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <Tooltip 
                        formatter={(value: number) => `${formatCurrency(value)}đ`} 
                        labelFormatter={(label) => `Tháng thứ ${label}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      <Area type="monotone" dataKey="balance" name="Tổng tài sản" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                      <Area type="monotone" dataKey="deposited" name="Gốc đã nộp" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrincipal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* FULL WIDTH TABLE */}
        {result.schedule.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mb-16 print:border-none print:shadow-none">
            <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Chi Tiết Dòng Tiền Từng Tháng</h3>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                <thead className="bg-slate-100 sticky top-0 z-10 print:bg-slate-50">
                  <tr>
                    <th className="p-5 font-bold text-slate-600 border-b">Kỳ (Tháng)</th>
                    <th className="p-5 font-bold text-slate-600 border-b text-right">Tổng gốc nộp</th>
                    <th className="p-5 font-bold text-emerald-600 border-b text-right">Lãi phát sinh</th>
                    <th className="p-5 font-bold text-emerald-600 border-b text-right">Tổng tiền lãi</th>
                    <th className="p-5 font-black text-blue-700 border-b text-right">Số Dư Tài Khoản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-900 bg-slate-50/50">{row.month}</td>
                      <td className="p-5 font-medium text-slate-600 text-right">{formatCurrency(row.deposited)}đ</td>
                      <td className="p-5 font-bold text-emerald-500 text-right">+{formatCurrency(row.interestEarned)}đ</td>
                      <td className="p-5 font-bold text-emerald-600 text-right">{formatCurrency(row.totalInterest)}đ</td>
                      <td className="p-5 font-black text-blue-700 bg-blue-50/30 text-right">{formatCurrency(row.balance)}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          4. KHU VỰC NỘI DUNG SEO (Tối ưu EEAT)
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Sức mạnh của Lãi kép (Compound Interest)</h2>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
              <p className="text-slate-600 leading-relaxed">Được thiên tài Albert Einstein ví như <strong>"Kỳ quan thứ 8 của thế giới"</strong>, lãi kép là chìa khóa vàng trong đầu tư và tích lũy tài sản.</p>
              <p className="text-slate-600 leading-relaxed">Bản chất của lãi kép xảy ra khi tiền lãi sinh ra từ số vốn ban đầu được tiếp tục cộng dồn lại vào gốc để sinh lãi cho các chu kỳ tiếp theo (lãi mẹ đẻ lãi con). Thời gian gửi càng dài, sức mạnh của lãi kép càng khủng khiếp.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Ba yếu tố quyết định tốc độ tăng trưởng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">⏳</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Thời gian</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Là yếu tố quan trọng nhất. Bắt đầu tích lũy càng sớm, đường cong tài sản càng dốc.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">📈</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Lãi suất</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Chỉ cần chênh lệch 1-2% lãi suất/năm cũng tạo ra sự khác biệt khổng lồ trong dài hạn.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-2xl mb-4">💰</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Kỷ luật nộp thêm</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Gửi thêm một khoản cố định mỗi tháng là bí quyết đẩy nhanh cỗ máy lãi kép hoạt động.</p>
              </div>

            </div>
          </section>

          {/* KHỐI LIÊN HỆ */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Liên hệ Tư vấn & Hỗ trợ Kỹ thuật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-400">Đội ngũ chuyên gia của "Số Chuẩn" luôn sẵn sàng hỗ trợ bạn lập kế hoạch tài chính cá nhân và tối ưu hóa các thuật toán dòng tiền.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3 items-center">📍 <span>Trụ sở chính: Quận Đống Đa, Hà Nội, Việt Nam</span></li>
                  <li className="flex gap-3 items-center">📞 <span>Hotline: 1900.xxxx</span></li>
                  <li className="flex gap-3 items-center">✉️ <span>Email: contact@sochuan.vn</span></li>
                </ul>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.095593888365!2d105.8239019!3d21.0288602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab748a044321%3A0x6b3017a61d6706e!2zxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ định vị Số Chuẩn">
                </iframe>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Style tùy chỉnh cho thanh cuộn bảng */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}