"use client";

import React, { useState, useMemo } from 'react';

type CalculationMethod = 'fixed' | 'declining';

interface PaymentSchedule {
  month: number;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}

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
        let monthlyInterest = 0;

        if (method === 'fixed') {
          // Tính trên dư nợ ban đầu
          monthlyInterest = principal * monthlyRate;
        } else {
          // Tính trên dư nợ giảm dần
          monthlyInterest = currentPrincipal * monthlyRate;
        }

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
        totalAmount: principal + totalInterest,
      },
      schedule
    };
  }, [amount, rate, months, method]);

  const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

  // Khởi tạo Schema Markup cho SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Công cụ tính lãi suất vay ngân hàng",
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
    "description": "Hệ thống tính lãi vay ngân hàng chuẩn xác, hỗ trợ phương pháp dư nợ giảm dần và dư nợ ban đầu, kèm bảng lịch trả nợ chi tiết."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center uppercase">
          Công Cụ Tính Lãi Vay Ngân Hàng
        </h1>
        <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">
          Dự tính chính xác số tiền gốc và lãi phải trả hàng tháng. Hỗ trợ xuất bảng chiết tính chi tiết để bạn dễ dàng hoạch định tài chính.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* CỘT NHẬP LIỆU */}
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền vay (VNĐ)</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  value={months}
                  onChange={(e) => setMonths(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  value={rate}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    if (val.split('.').length <= 2) setRate(val);
                  }}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Phương pháp tính</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <input type="radio" checked={method === 'declining'} onChange={() => setMethod('declining')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Trả trên dư nợ giảm dần</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <input type="radio" checked={method === 'fixed'} onChange={() => setMethod('fixed')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Trả trên dư nợ ban đầu</span>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT TỔNG QUAN */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white">
              <h3 className="text-lg font-semibold text-slate-400 mb-6 uppercase tracking-wider">Tóm Tắt Khoản Vay</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                  <div className="text-sm font-medium text-slate-400 mb-2">Tổng tiền gốc</div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalPrincipal)}đ</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                  <div className="text-sm font-medium text-slate-400 mb-2">Tổng lãi phải trả</div>
                  <div className="text-2xl font-bold text-rose-400">{formatCurrency(summary.totalInterest)}đ</div>
                </div>
                <div className="bg-blue-600/20 rounded-2xl p-5 border border-blue-500/30">
                  <div className="text-sm font-bold text-blue-300 mb-2">Tổng gốc + lãi</div>
                  <div className="text-2xl font-black text-white">{formatCurrency(summary.totalAmount)}đ</div>
                </div>
              </div>
            </div>

            {/* BẢNG LỊCH TRẢ NỢ */}
            {schedule.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-800">Lịch Trả Nợ Chi Tiết</h3>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="p-4 font-bold text-slate-600 border-b">Kỳ (Tháng)</th>
                        <th className="p-4 font-bold text-slate-600 border-b">Dư nợ đầu kỳ</th>
                        <th className="p-4 font-bold text-slate-600 border-b">Gốc phải trả</th>
                        <th className="p-4 font-bold text-slate-600 border-b">Lãi phải trả</th>
                        <th className="p-4 font-bold text-blue-700 border-b">Tổng tiền trả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{row.month}</td>
                          <td className="p-4 text-slate-600">{formatCurrency(row.remainingPrincipal)}đ</td>
                          <td className="p-4 text-slate-600">{formatCurrency(row.principalPayment)}đ</td>
                          <td className="p-4 text-rose-500">{formatCurrency(row.interestPayment)}đ</td>
                          <td className="p-4 font-bold text-blue-700">{formatCurrency(row.totalPayment)}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}