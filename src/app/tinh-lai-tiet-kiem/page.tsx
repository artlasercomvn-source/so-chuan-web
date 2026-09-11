"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SavingsSchedule {
  month: number;
  deposited: number;
  interestEarned: number;
  totalInterest: number;
  balance: number;
}

export default function SavingsCalculator() {
  const [initialDeposit, setInitialDeposit] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [months, setMonths] = useState<string>("");
  const [result, setResult] = useState<{
    totalBalance: number;
    totalPrincipal: number;
    totalInterest: number;
    schedule: SavingsSchedule[];
  } | null>(null);

  // 1. TÍNH NĂNG BỘ NHỚ THÔNG MINH
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

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const principal = parseFloat(initialDeposit.replace(/,/g, "")) || 0;
    const contribution = parseFloat(monthlyContribution.replace(/,/g, "")) || 0;
    const ratePerYear = parseFloat(interestRate.replace(/,/g, ""));
    const termMonths = parseInt(months.replace(/,/g, ""));

    if ((principal === 0 && contribution === 0) || isNaN(ratePerYear) || isNaN(termMonths) || ratePerYear <= 0 || termMonths <= 0) {
      return;
    }

    localStorage.setItem('savings_initial', initialDeposit);
    localStorage.setItem('savings_monthly', monthlyContribution);
    localStorage.setItem('savings_rate', interestRate);
    localStorage.setItem('savings_months', months);

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

    setResult({
      totalBalance: currentBalance,
      totalPrincipal,
      totalInterest: accumulatedInterest,
      schedule,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-amber-600 hover:underline font-medium inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-amber-500 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl font-extrabold text-white mb-2 print:text-black">Báo Cáo Phân Tích Lãi Gửi Tiết Kiệm</h1>
            <p className="text-amber-50 print:text-gray-600">Được xuất bởi nền tảng Số Chuẩn - Kế hoạch tăng trưởng tài sản với lãi kép</p>
          </div>

          <div className="p-8 md:p-10 space-y-6 print:p-0 print:mt-6">
            {/* KHU VỰC NHẬP LIỆU (Ẩn khi in PDF) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số tiền gửi ban đầu (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 100,000,000"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={initialDeposit}
                  onChange={(e) => handleNumberFormat(e.target.value, setInitialDeposit, 'savings_initial')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gửi thêm mỗi tháng (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 5,000,000"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={monthlyContribution}
                  onChange={(e) => handleNumberFormat(e.target.value, setMonthlyContribution, 'savings_monthly')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lãi suất (%/năm)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 6.5"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={interestRate}
                  onChange={(e) => {
                    setInterestRate(e.target.value);
                    localStorage.setItem('savings_rate', e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian gửi (Tháng)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 36"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={months}
                  onChange={(e) => handleNumberFormat(e.target.value, setMonths, 'savings_months')}
                />
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition shadow-md text-lg mt-4 print:hidden"
            >
              Phân tích Dòng tiền
            </button>

            {/* KẾT QUẢ & BIỂU ĐỒ */}
            {result !== null && (
              <div className="mt-10 space-y-8 animate-fade-in print:mt-0">
                
                {/* Thanh điều khiển phụ */}
                <div className="flex justify-end print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Lưu thành file PDF / In báo cáo
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 print:border-none print:bg-white print:p-0">
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 print:text-black">Tổng tài sản cuối kỳ</p>
                  <div className="text-4xl md:text-5xl font-extrabold text-amber-600 mb-6 print:text-black">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.totalBalance))} <span className="text-2xl font-bold opacity-80">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-amber-200/60 print:border-black">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">Tổng tiền gốc đã nộp</div>
                      <div className="text-2xl font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.totalPrincipal))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">Tổng tiền lãi nhận được</div>
                      <div className="text-2xl font-bold text-green-600 print:text-black">+{new Intl.NumberFormat('vi-VN').format(Math.round(result.totalInterest))}</div>
                    </div>
                  </div>
                </div>

                {/* BIỂU ĐỒ VÙNG (Area Chart) - Thể hiện sự phình to của tài sản */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                  <h3 className="font-bold text-gray-800 mb-6 text-center print:text-left">Biểu đồ tăng trưởng tài sản (Gốc vs Lãi kép)</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.schedule} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{fontSize: 12}} tickFormatter={(value) => `Tháng ${value}`} />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} tick={{fontSize: 12}} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' VNĐ'} labelFormatter={(label) => `Kỳ tính lãi: Tháng ${label}`} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        <Area type="monotone" dataKey="balance" name="Tổng tài sản (Gốc + Lãi)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBalance)" />
                        <Area type="monotone" dataKey="deposited" name="Tổng gốc đã nộp" stroke="#9ca3af" fillOpacity={1} fill="url(#colorPrincipal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bảng chi tiết */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm print:border-none print:shadow-none">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white print:px-0">
                    <h3 className="font-bold text-gray-800">Bảng theo dõi dòng tiền chi tiết</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto print:max-h-none print:overflow-visible">
                    <table className="w-full text-sm text-left text-gray-600 print:text-black">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 shadow-sm print:bg-white print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 font-bold text-center">Tháng</th>
                          <th className="px-6 py-4 font-bold text-right">Tổng gốc nộp</th>
                          <th className="px-6 py-4 font-bold text-right">Lãi phát sinh</th>
                          <th className="px-6 py-4 font-bold text-right">Tổng lãi</th>
                          <th className="px-6 py-4 font-bold text-right">Số dư tài khoản</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((item) => (
                          <tr key={item.month} className="border-b border-gray-50 hover:bg-gray-50 transition print:border-b print:border-gray-300">
                            <td className="px-6 py-4 font-medium text-center">{item.month}</td>
                            <td className="px-6 py-4 text-right">{new Intl.NumberFormat('vi-VN').format(Math.round(item.deposited))}</td>
                            <td className="px-6 py-4 text-right text-green-600 print:text-black">+{new Intl.NumberFormat('vi-VN').format(Math.round(item.interestEarned))}</td>
                            <td className="px-6 py-4 text-right font-bold text-amber-600 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(item.totalInterest))}</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(item.balance))}</td>
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

        {/* BÀI VIẾT SEO (Ẩn khi in) */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-gray-700 leading-relaxed prose prose-amber max-w-none print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sức mạnh của Lãi kép (Compound Interest)</h2>
          <p className="mb-4 text-justify">Được Albert Einstein ví như "Kỳ quan thứ 8 của thế giới", lãi kép xảy ra khi tiền lãi sinh ra từ số vốn ban đầu được nhập lại vào gốc.</p>
        </article>
      </div>
    </div>
  );
}