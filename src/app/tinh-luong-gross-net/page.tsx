"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TAX_CONFIG } from "@/config/tax";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GrossNetCalculator() {
  const [grossInput, setGrossInput] = useState<string>("");
  const [dependents, setDependents] = useState<string>("0");
  const [result, setResult] = useState<{
    gross: number;
    bhxh: number;
    bhyt: number;
    bhtn: number;
    totalInsurance: number;
    taxableIncome: number;
    tax: number;
    net: number;
  } | null>(null);

  // 1. TÍNH NĂNG BỘ NHỚ THÔNG MINH
  useEffect(() => {
    const savedGross = localStorage.getItem('gross_salary');
    const savedDeps = localStorage.getItem('gross_dependents');
    if (savedGross) setGrossInput(savedGross);
    if (savedDeps) setDependents(savedDeps);
  }, []);

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const gross = parseFloat(grossInput.replace(/,/g, ""));
    const numDependents = parseInt(dependents) || 0;
    if (isNaN(gross) || gross <= 0) return;

    localStorage.setItem('gross_salary', grossInput);
    localStorage.setItem('gross_dependents', dependents);

    const maxInsuranceSalary = TAX_CONFIG.BASE_SALARY * 20;
    const insuranceBase = Math.min(gross, maxInsuranceSalary);
    const bhxh = insuranceBase * TAX_CONFIG.INSURANCE_RATES.BHXH;
    const bhyt = insuranceBase * TAX_CONFIG.INSURANCE_RATES.BHYT;
    
    const maxBhtnSalary = TAX_CONFIG.MIN_WAGE_REGION_1 * 20;
    const bhtnBase = Math.min(gross, maxBhtnSalary);
    const bhtn = bhtnBase * TAX_CONFIG.INSURANCE_RATES.BHTN;

    const totalInsurance = bhxh + bhyt + bhtn;
    const totalDeduction = TAX_CONFIG.DEDUCTION_PERSONAL + (numDependents * TAX_CONFIG.DEDUCTION_DEPENDENT);
    const incomeAfterInsurance = gross - totalInsurance;
    const taxableIncome = Math.max(0, incomeAfterInsurance - totalDeduction);

    let tax = 0;
    for (const bracket of TAX_CONFIG.TAX_BRACKETS) {
      if (taxableIncome <= bracket.upTo) {
        tax = taxableIncome * bracket.rate - bracket.subtraction;
        break;
      }
    }
    tax = Math.max(0, tax);
    const net = gross - totalInsurance - tax;
    setResult({ gross, bhxh, bhyt, bhtn, totalInsurance, taxableIncome, tax, net });
  };

  const handlePrint = () => {
    window.print();
  };

  // Dữ liệu cho biểu đồ tròn
  const chartData = result ? [
    { name: 'Thực nhận (Net)', value: result.net, color: '#22c55e' },
    { name: 'BHXH (8%)', value: result.bhxh, color: '#3b82f6' },
    { name: 'BHYT (1.5%)', value: result.bhyt, color: '#06b6d4' },
    { name: 'BHTN (1%)', value: result.bhtn, color: '#8b5cf6' },
    { name: 'Thuế TNCN', value: result.tax, color: '#ef4444' },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-blue-600 hover:underline font-medium inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-blue-600 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl font-extrabold text-white mb-2 print:text-black">Báo Cáo Chiết Tính Lương Gross - Net</h1>
            <p className="text-blue-100 print:text-gray-600">Được xuất bởi nền tảng Số Chuẩn - Chuẩn hóa theo biểu thuế lũy tiến hiện hành</p>
          </div>

          <div className="p-8 md:p-10 space-y-6 print:p-0 print:mt-6">
            {/* KHU VỰC NHẬP LIỆU (Ẩn khi in) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lương Gross (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 25,000,000"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={grossInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setGrossInput, 'gross_salary')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số người phụ thuộc</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={dependents}
                  onChange={(e) => {
                    setDependents(e.target.value);
                    localStorage.setItem('gross_dependents', e.target.value);
                  }}
                />
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md text-lg print:hidden"
            >
              Phân tích Lương
            </button>

            {/* KẾT QUẢ & BIỂU ĐỒ */}
            {result !== null && (
              <div className="mt-10 space-y-8 animate-fade-in print:mt-0">
                
                <div className="flex justify-end print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Lưu thành file PDF / In báo cáo
                  </button>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 print:border-none print:bg-white print:p-0">
                  <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2 print:text-black">Lương thực nhận (Net)</p>
                  <div className="text-4xl md:text-5xl font-extrabold text-green-600 mb-6 print:text-black">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.net))} <span className="text-2xl font-bold opacity-80">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-green-200/60 print:border-black">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">BHXH (8%)</div>
                      <div className="font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.bhxh))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">BHYT (1.5%)</div>
                      <div className="font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.bhyt))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">BHTN (1%)</div>
                      <div className="font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.bhtn))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">Thuế TNCN</div>
                      <div className="font-bold text-red-500 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.tax))}</div>
                    </div>
                  </div>
                </div>

                {/* BIỂU ĐỒ TRÒN (Pie Chart) - Phân rã cấu trúc lương */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                  <h3 className="font-bold text-gray-800 mb-6 text-center print:text-left">Biểu đồ cơ cấu phân bổ dòng tiền lương Gross</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={130}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' VNĐ'} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-gray-700 leading-relaxed print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lương Gross và Lương Net là gì?</h2>
          <p className="mb-4 text-justify">Lương Gross là tổng thu nhập mà doanh nghiệp trả cho người lao động...</p>
        </article>
      </div>
    </div>
  );
}