"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TaxFinalizationCalculator() {
  const [totalIncomeInput, setTotalIncomeInput] = useState<string>("");
  const [taxDeductedInput, setTaxDeductedInput] = useState<string>("");
  const [dependents, setDependents] = useState<string>("0");
  const [dependentMonths, setDependentMonths] = useState<string>("12");
  
  const [result, setResult] = useState<{
    totalIncome: number;
    totalDeduction: number;
    taxableIncome: number;
    finalTax: number;
    difference: number;
    status: 'refund' | 'payable' | 'none';
  } | null>(null);

  // 1. BỘ NHỚ THÔNG MINH (Local Storage)
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

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const totalIncome = parseFloat(totalIncomeInput.replace(/,/g, "")) || 0;
    const taxDeducted = parseFloat(taxDeductedInput.replace(/,/g, "")) || 0;
    const numDependents = parseInt(dependents) || 0;
    const months = parseInt(dependentMonths) || 12;

    if (totalIncome <= 0) return;

    localStorage.setItem('tax_total_income', totalIncomeInput);
    localStorage.setItem('tax_deducted', taxDeductedInput);
    localStorage.setItem('tax_dependents', dependents);
    localStorage.setItem('tax_dep_months', dependentMonths);

    // Giảm trừ gia cảnh (Tính theo năm)
    const personalDeduction = 132000000; // 11tr x 12 tháng
    const dependentDeduction = 4400000 * numDependents * months;
    const totalDeduction = personalDeduction + dependentDeduction;
    
    // Thu nhập tính thuế (Năm)
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    // Biểu thuế lũy tiến theo NĂM
    const yearlyBrackets = [
      { upTo: 60000000, rate: 0.05, subtraction: 0 },
      { upTo: 120000000, rate: 0.10, subtraction: 3000000 },
      { upTo: 216000000, rate: 0.15, subtraction: 9000000 },
      { upTo: 384000000, rate: 0.20, subtraction: 19800000 },
      { upTo: 624000000, rate: 0.25, subtraction: 39000000 },
      { upTo: 960000000, rate: 0.30, subtraction: 70200000 },
      { upTo: Infinity, rate: 0.35, subtraction: 118200000 },
    ];

    let finalTax = 0;
    for (const bracket of yearlyBrackets) {
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

    setResult({
      totalIncome,
      totalDeduction,
      taxableIncome,
      finalTax,
      difference: Math.abs(difference),
      status
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // 2. DATA VISUALIZATION: Cơ cấu phân bổ Tổng thu nhập
  const chartData = result ? [
    { name: 'Tổng mức giảm trừ gia cảnh', value: Math.min(result.totalIncome, result.totalDeduction), color: '#06b6d4' },
    { name: 'Thuế TNCN thực tế nộp', value: result.finalTax, color: '#ef4444' },
    { name: 'Thu nhập ròng sau thuế', value: Math.max(0, result.totalIncome - Math.min(result.totalIncome, result.totalDeduction) - result.finalTax), color: '#22c55e' }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-cyan-600 hover:underline font-medium inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-cyan-600 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl font-extrabold text-white mb-2 print:text-black">Báo Cáo Quyết Toán Thuế TNCN</h1>
            <p className="text-cyan-100 print:text-gray-600">Được xuất bởi nền tảng Số Chuẩn - Xác định mức hoàn/truy thu thuế chính xác</p>
          </div>

          <div className="p-8 md:p-10 space-y-6 print:p-0 print:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tổng thu nhập chịu thuế trong năm (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 500,000,000"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  value={totalIncomeInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setTotalIncomeInput, 'tax_total_income')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tổng số thuế đã tạm nộp/khấu trừ (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 35,000,000 (Ghi trên chứng từ khấu trừ)"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  value={taxDeductedInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setTaxDeductedInput, 'tax_deducted')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số người phụ thuộc</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  value={dependents}
                  onChange={(e) => {
                    setDependents(e.target.value);
                    localStorage.setItem('tax_dependents', e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số tháng tính giảm trừ</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  value={dependentMonths}
                  onChange={(e) => {
                    setDependentMonths(e.target.value);
                    localStorage.setItem('tax_dep_months', e.target.value);
                  }}
                />
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl transition shadow-md text-lg mt-4 print:hidden"
            >
              Phân tích Quyết toán thuế
            </button>

            {result !== null && (
              <div className="mt-10 animate-fade-in print:mt-0">
                
                <div className="flex justify-end mb-8 print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Lưu thành file PDF / In báo cáo
                  </button>
                </div>

                <div className={`border rounded-2xl p-8 mb-8 print:border-none print:p-0 print:mb-6 ${
                  result.status === 'refund' ? 'bg-green-50 border-green-200 print:bg-white' : 
                  result.status === 'payable' ? 'bg-red-50 border-red-200 print:bg-white' : 
                  'bg-gray-50 border-gray-200 print:bg-white'
                }`}>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-2 print:text-black ${
                    result.status === 'refund' ? 'text-green-800' : 
                    result.status === 'payable' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {result.status === 'refund' ? 'Số tiền thuế BẠN ĐƯỢC HOÀN LẠI' : 
                     result.status === 'payable' ? 'Số tiền thuế BẠN PHẢI NỘP THÊM' : 'Bạn đã nộp ĐỦ THUẾ'}
                  </p>
                  
                  <div className={`text-4xl md:text-5xl font-extrabold mb-6 print:text-black ${
                    result.status === 'refund' ? 'text-green-600' : 
                    result.status === 'payable' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.difference))} <span className="text-2xl font-bold opacity-80">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-black/10 print:border-black">
                    <div>
                      <div className="text-xs text-gray-600 mb-1 print:text-black">Thu nhập tính thuế (Sau khi trừ gia cảnh)</div>
                      <div className="text-xl font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.taxableIncome))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1 print:text-black">Tổng thuế thực tế phải nộp cả năm</div>
                      <div className="text-xl font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.finalTax))}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                  <h3 className="font-bold text-gray-800 mb-6 text-center print:text-left">Biểu đồ cơ cấu thu nhập cá nhân</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={3}
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

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-gray-700 leading-relaxed prose prose-cyan max-w-none print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quyết toán thuế TNCN là gì?</h2>
          <p className="mb-4 text-justify">Cuối năm, Cơ quan Thuế sẽ gom toàn bộ thu nhập của bạn lại và tính toán lại theo biểu thuế lũy tiến từng phần, đồng thời áp dụng các mức giảm trừ gia cảnh...</p>
        </article>
      </div>
    </div>
  );
}