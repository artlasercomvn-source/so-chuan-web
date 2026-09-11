"use client";

import React, { useState, useMemo } from 'react';

type CalculationMethod = 'fixed' | 'declining';
interface PaymentSchedule { month: number; remainingPrincipal: number; principalPayment: number; interestPayment: number; totalPayment: number; }

export default function LoanCalculator() {
  const [amount, setAmount] = useState<string>('1000000000');
  const [rate, setRate] = useState<string>('10.5');
  const [months, setMonths] = useState<string>('12');
  const [method, setMethod] = useState<CalculationMethod>('declining');

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
        let monthlyInterest = method === 'fixed' ? (principal * monthlyRate) : (currentPrincipal * monthlyRate);
        const totalPayment = monthlyPrincipal + monthlyInterest;
        totalInterest += monthlyInterest;
        schedule.push({ month: i, remainingPrincipal: Math.max(0, currentPrincipal), principalPayment: monthlyPrincipal, interestPayment: monthlyInterest, totalPayment: totalPayment });
        currentPrincipal -= monthlyPrincipal;
      }
    }
    return { summary: { totalPrincipal: principal, totalInterest: totalInterest, totalAmount: principal + totalAmount }, schedule };
  }, [amount, rate, months, method]);

  const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');
  const handlePrint = () => { window.print(); };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lãi suất vay ngân hàng chuẩn xác",
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Quay lại trang chủ
          </a>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> In lịch trả nợ / Lưu PDF
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center uppercase tracking-tight">Công Cụ Tính Lãi Vay Ngân Hàng</h1>
        <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">Xuất bản chi tiết lịch trả nợ hàng tháng giúp bạn kiểm soát dòng tiền và hoạch định kế hoạch mua nhà, mua xe dễ dàng.</p>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit print:border-none print:shadow-none">
            <div className="mb-6"><label className="block text-sm font-bold text-slate-700 mb-2">Số tiền vay (VNĐ)</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} /></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={months} onChange={(e) => setMonths(e.target.value.replace(/\D/g, ''))} /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={rate} onChange={(e) => { const val = e.target.value.replace(/[^0-9.]/g, ''); if (val.split('.').length <= 2) setRate(val); }} /></div>
            </div>
            <div className="mb-2 print:hidden">
              <label className="block text-sm font-bold text-slate-700 mb-3">Phương pháp tính</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50"><input type="radio" checked={method === 'declining'} onChange={() => setMethod('declining')} className="w-5 h-5 text-blue-600" /><span className="font-medium text-slate-700">Trả trên dư nợ giảm dần</span></label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50"><input type="radio" checked={method === 'fixed'} onChange={() => setMethod('fixed')} className="w-5 h-5 text-blue-600" /><span className="font-medium text-slate-700">Trả trên dư nợ ban đầu</span></label>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white">
              <h3 className="text-lg font-semibold text-slate-400 mb-6 uppercase tracking-wider">Tóm Tắt Khoản Vay</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700"><div className="text-sm font-medium text-slate-400 mb-2">Tổng tiền gốc</div><div className="text-2xl font-bold text-white">{formatCurrency(summary.totalPrincipal)}đ</div></div>
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700"><div className="text-sm font-medium text-slate-400 mb-2">Tổng lãi phải trả</div><div className="text-2xl font-bold text-rose-400">{formatCurrency(summary.totalInterest)}đ</div></div>
                <div className="bg-blue-600/20 rounded-2xl p-5 border border-blue-500/30"><div className="text-sm font-bold text-blue-300 mb-2">Tổng gốc + lãi</div><div className="text-2xl font-black text-white">{formatCurrency(summary.totalAmount)}đ</div></div>
              </div>
            </div>
            {schedule.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-bold text-slate-800">Lịch Trả Nợ Chi Tiết</h3></div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto print:max-h-none">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                      <tr><th className="p-4 font-bold text-slate-600 border-b">Kỳ (Tháng)</th><th className="p-4 font-bold text-slate-600 border-b">Dư nợ đầu kỳ</th><th className="p-4 font-bold text-slate-600 border-b">Gốc phải trả</th><th className="p-4 font-bold text-slate-600 border-b">Lãi phải trả</th><th className="p-4 font-bold text-blue-700 border-b">Tổng tiền trả</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50"><td className="p-4 font-medium text-slate-900">{row.month}</td><td className="p-4 text-slate-600">{formatCurrency(row.remainingPrincipal)}đ</td><td className="p-4 text-slate-600">{formatCurrency(row.principalPayment)}đ</td><td className="p-4 text-rose-500">{formatCurrency(row.interestPayment)}đ</td><td className="p-4 font-bold text-blue-700">{formatCurrency(row.totalPayment)}đ</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG MỞ RỘNG */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Phân biệt các phương pháp tính lãi</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Tính theo dư nợ ban đầu</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tiền lãi được tính dựa trên số tiền vay ban đầu trong suốt thời gian vay.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Mỗi tháng trả số tiền giống hệt nhau.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Dễ nhớ, dễ quản lý chi tiêu.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Thường áp dụng cho vay tiêu dùng, vay tín chấp nhỏ.</span></li>
                </ul>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">Tính theo dư nợ giảm dần</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tiền lãi chỉ tính trên số tiền thực tế bạn còn nợ ngân hàng.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Tháng đầu trả nhiều, các tháng sau giảm dần.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Tổng tiền lãi phải trả thực tế ít hơn.</span></li>
                  <li className="flex items-start gap-2"><span>▪️</span> <span>Thường áp dụng vay mua nhà, mua ô tô.</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Công thức tính toán chi tiết</h2>
            <div className="space-y-4">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                <div className="font-bold text-white mb-2">Tiền gốc hàng tháng:</div>
                <div className="text-blue-400 font-mono bg-slate-900 p-3 rounded-lg border border-slate-700">
                  Gốc = Tổng số tiền vay / Tổng số tháng vay
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                <div className="font-bold text-white mb-2">Tiền lãi tháng đầu:</div>
                <div className="text-emerald-400 font-mono bg-slate-900 p-3 rounded-lg border border-slate-700">
                  Lãi tháng 1 = Tổng tiền vay ban đầu × Lãi suất theo tháng
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                <div className="font-bold text-white mb-2">Tiền lãi các tháng tiếp theo (Giảm dần):</div>
                <div className="text-rose-400 font-mono bg-slate-900 p-3 rounded-lg border border-slate-700">
                  Lãi tháng n = (Tổng tiền vay - Gốc đã trả) × Lãi suất theo tháng
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}