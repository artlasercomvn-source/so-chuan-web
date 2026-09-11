"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScheduleItem {
  month: number;
  principal: number;
  interest: number;
  total: number;
  remaining: number;
  accumulatedInterest: number;
}

export default function LoanCalculator() {
  const [principalInput, setPrincipalInput] = useState<string>("");
  const [rateInput, setRateInput] = useState<string>("");
  const [monthsInput, setMonthsInput] = useState<string>("");
  const [result, setResult] = useState<{
    firstMonthPayment: number;
    totalInterest: number;
    totalPayment: number;
    schedule: ScheduleItem[];
  } | null>(null);

  useEffect(() => {
    const savedPrincipal = localStorage.getItem('loan_principal');
    const savedRate = localStorage.getItem('loan_rate');
    const savedMonths = localStorage.getItem('loan_months');
    if (savedPrincipal) setPrincipalInput(savedPrincipal);
    if (savedRate) setRateInput(savedRate);
    if (savedMonths) setMonthsInput(savedMonths);
  }, []);

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const principal = parseFloat(principalInput.replace(/,/g, ""));
    const ratePerYear = parseFloat(rateInput.replace(/,/g, ""));
    const months = parseInt(monthsInput.replace(/,/g, ""));

    if (isNaN(principal) || isNaN(ratePerYear) || isNaN(months) || principal <= 0 || ratePerYear <= 0 || months <= 0) return;

    localStorage.setItem('loan_principal', principalInput);
    localStorage.setItem('loan_rate', rateInput);
    localStorage.setItem('loan_months', monthsInput);

    const principalPerMonth = principal / months;
    const ratePerMonth = (ratePerYear / 100) / 12;
    
    let totalInterest = 0;
    let currentPrincipal = principal;
    let firstMonthPayment = 0;
    const schedule: ScheduleItem[] = [];

    for (let i = 1; i <= months; i++) {
      const interestThisMonth = currentPrincipal * ratePerMonth;
      const totalThisMonth = principalPerMonth + interestThisMonth;
      
      totalInterest += interestThisMonth;
      currentPrincipal -= principalPerMonth;
      
      if (i === 1) firstMonthPayment = totalThisMonth;

      schedule.push({
        month: i,
        principal: principalPerMonth,
        interest: interestThisMonth,
        total: totalThisMonth,
        remaining: Math.max(0, currentPrincipal),
        accumulatedInterest: totalInterest
      });
    }

    setResult({ firstMonthPayment, totalInterest, totalPayment: principal + totalInterest, schedule });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-green-600 hover:underline font-bold inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-12 border-b border-slate-100 bg-green-600 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight print:text-black">Báo Cáo Phân Tích Lãi Vay Mua Nhà</h1>
            <p className="text-green-100 font-medium print:text-slate-600">Được xuất bởi nền tảng Số Chuẩn - Kế hoạch trả nợ theo dư nợ giảm dần</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 print:p-0 print:mt-6">
            {/* NHẬP LIỆU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Số tiền vay (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1,000,000,000"
                  className="w-full text-2xl font-black px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  value={principalInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setPrincipalInput, 'loan_principal')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Lãi suất (%/năm)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 8.5"
                  className="w-full text-2xl font-black px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  value={rateInput}
                  onChange={(e) => {
                    setRateInput(e.target.value);
                    localStorage.setItem('loan_rate', e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Thời gian (Tháng)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 120"
                  className="w-full text-2xl font-black px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  value={monthsInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setMonthsInput, 'loan_months')}
                />
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={handleCalculate}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_4px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.3)] hover:-translate-y-0.5 text-xl"
                >
                  Phân tích ngay
                </button>
              </div>
            </div>

            {/* KẾT QUẢ */}
            {result !== null && (
              <div className="mt-12 space-y-8 animate-fade-in print:mt-0">
                <div className="flex justify-end print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Xuất báo cáo PDF
                  </button>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 md:p-10 print:border-none print:bg-white print:p-0">
                  <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 print:text-black">Tháng đầu tiên phải trả</p>
                  <div className="text-5xl md:text-6xl font-black text-emerald-600 mb-8 tracking-tighter print:text-black">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.firstMonthPayment))} <span className="text-2xl md:text-3xl font-bold opacity-70 tracking-normal">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-emerald-200/60 print:border-black">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-black">Tổng tiền lãi phải trả</div>
                      <div className="text-2xl font-black text-rose-500 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.totalInterest))}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-black">Tổng gốc + lãi</div>
                      <div className="text-2xl font-black text-slate-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.totalPayment))}</div>
                    </div>
                  </div>
                </div>

                {/* KHỐI MONETIZATION (AFFILIATE) - Đẳng cấp, ẩn khi in PDF */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm print:hidden">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                      <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      Cơ hội tài trợ vốn
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Gói vay mua nhà lãi suất ưu đãi chỉ từ 6.5%/năm</h3>
                    <p className="text-slate-600 text-sm font-medium">Số Chuẩn đối tác chiến lược của Vietcombank, Shinhan Bank, VIB... Duyệt hồ sơ nhanh chóng, miễn phí định giá tài sản.</p>
                  </div>
                  {/* Chèn link Affiliate vào thuộc tính href bên dưới */}
                  <a href="#" target="_blank" className="w-full md:w-auto text-center px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md whitespace-nowrap">
                    Xem gói vay ngay
                  </a>
                </div>

                {/* BIỂU ĐỒ */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
                  <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm print:text-left">Đối chiếu: Dư nợ giảm dần & Lãi cộng dồn</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.schedule} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{fontSize: 12}} tickFormatter={(value) => `Tháng ${value}`} />
                        <YAxis yAxisId="left" tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} tick={{fontSize: 12}} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} tick={{fontSize: 12}} />
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' VNĐ'} labelFormatter={(label) => `Kỳ thanh toán: Tháng ${label}`} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        <Line yAxisId="left" type="monotone" dataKey="remaining" name="Dư nợ còn lại (Trái)" stroke="#059669" strokeWidth={3} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="accumulatedInterest" name="Tổng lãi đã trả (Phải)" stroke="#e11d48" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* BẢNG CHI TIẾT */}
                <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm print:border-none print:shadow-none">
                  <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 print:bg-white print:px-0">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Lịch trả nợ chi tiết</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto print:max-h-none print:overflow-visible">
                    <table className="w-full text-sm text-left text-slate-600 print:text-black">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 shadow-sm print:bg-white print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 font-bold text-center">Tháng</th>
                          <th className="px-6 py-4 font-bold text-right">Gốc trả</th>
                          <th className="px-6 py-4 font-bold text-right">Lãi trả</th>
                          <th className="px-6 py-4 font-bold text-right">Tổng cộng</th>
                          <th className="px-6 py-4 font-bold text-right">Dư nợ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((item) => (
                          <tr key={item.month} className="border-b border-slate-50 hover:bg-slate-50 transition print:border-b print:border-slate-300">
                            <td className="px-6 py-4 font-medium text-center">{item.month}</td>
                            <td className="px-6 py-4 text-right font-medium">{new Intl.NumberFormat('vi-VN').format(Math.round(item.principal))}</td>
                            <td className="px-6 py-4 text-right font-bold text-rose-500 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(item.interest))}</td>
                            <td className="px-6 py-4 text-right font-black text-emerald-600 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(item.total))}</td>
                            <td className="px-6 py-4 text-right font-medium">{new Intl.NumberFormat('vi-VN').format(Math.round(item.remaining))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* BÀI VIẾT SEO */}
        <article className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 text-slate-600 leading-relaxed print:hidden">
          <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Cách tính lãi vay theo dư nợ giảm dần</h2>
          <p className="mb-4 text-justify font-medium">Phương pháp dư nợ giảm dần là cách tính lãi phổ biến nhất tại các ngân hàng hiện nay. Số tiền lãi bạn phải trả sẽ giảm dần qua từng tháng, giúp giảm bớt gánh nặng tài chính về sau.</p>
        </article>
      </div>
    </div>
  );
}