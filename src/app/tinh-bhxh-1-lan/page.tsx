"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BHXHCalculator() {
  const [avgSalaryInput, setAvgSalaryInput] = useState<string>("");
  const [yearsBefore2014, setYearsBefore2014] = useState<string>("");
  const [yearsAfter2014, setYearsAfter2014] = useState<string>("");
  const [result, setResult] = useState<{
    totalAmount: number;
    amountBefore2014: number;
    amountAfter2014: number;
  } | null>(null);

  useEffect(() => {
    const savedSalary = localStorage.getItem('bhxh_salary');
    const savedBefore = localStorage.getItem('bhxh_before_2014');
    const savedAfter = localStorage.getItem('bhxh_after_2014');
    if (savedSalary) setAvgSalaryInput(savedSalary);
    if (savedBefore) setYearsBefore2014(savedBefore);
    if (savedAfter) setYearsAfter2014(savedAfter);
  }, []);

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const avgSalary = parseFloat(avgSalaryInput.replace(/,/g, ""));
    const before2014 = parseFloat(yearsBefore2014) || 0;
    const after2014 = parseFloat(yearsAfter2014) || 0;

    if (isNaN(avgSalary) || avgSalary <= 0 || (before2014 === 0 && after2014 === 0)) return;

    localStorage.setItem('bhxh_salary', avgSalaryInput);
    localStorage.setItem('bhxh_before_2014', yearsBefore2014);
    localStorage.setItem('bhxh_after_2014', yearsAfter2014);

    const amountBefore2014 = before2014 * 1.5 * avgSalary;
    const amountAfter2014 = after2014 * 2 * avgSalary;
    const totalAmount = amountBefore2014 + amountAfter2014;

    setResult({ totalAmount, amountBefore2014, amountAfter2014 });
  };

  const handlePrint = () => {
    window.print();
  };

  const chartData = result ? [
    { name: 'Giai đoạn trước 2014', value: result.amountBefore2014, color: '#a855f7' },
    { name: 'Giai đoạn từ 2014', value: result.amountAfter2014, color: '#d946ef' },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-purple-600 hover:underline font-medium inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-purple-600 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl font-extrabold text-white mb-2 print:text-black">Báo Cáo Chiết Tính BHXH 1 Lần</h1>
            <p className="text-purple-100 print:text-gray-600">Được xuất bởi nền tảng Số Chuẩn - Áp dụng hệ số luật BHXH hiện hành</p>
          </div>

          <div className="p-8 md:p-10 space-y-6 print:p-0 print:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Mức bình quân tiền lương đóng BHXH (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 8,000,000"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={avgSalaryInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setAvgSalaryInput, 'bhxh_salary')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số năm đóng trước 2014</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={yearsBefore2014}
                  onChange={(e) => {
                    setYearsBefore2014(e.target.value);
                    localStorage.setItem('bhxh_before_2014', e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số năm đóng từ 2014 trở đi</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="w-full text-xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={yearsAfter2014}
                  onChange={(e) => {
                    setYearsAfter2014(e.target.value);
                    localStorage.setItem('bhxh_after_2014', e.target.value);
                  }}
                />
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition shadow-md text-lg mt-4 print:hidden"
            >
              Phân tích Mức hưởng
            </button>

            {result !== null && (
              <div className="mt-10 space-y-8 animate-fade-in print:mt-0">
                <div className="flex justify-end print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Lưu thành file PDF / In báo cáo
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8 print:border-none print:bg-white print:p-0">
                  <p className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-2 print:text-black">Tổng tiền nhận được</p>
                  <div className="text-4xl md:text-5xl font-extrabold text-purple-600 mb-6 print:text-black">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.totalAmount))} <span className="text-2xl font-bold opacity-80">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-purple-200/60 print:border-black">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">Giai đoạn trước 2014 (Hệ số 1.5)</div>
                      <div className="text-xl font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.amountBefore2014))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 print:text-black">Giai đoạn từ 2014 (Hệ số 2.0)</div>
                      <div className="text-xl font-bold text-gray-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.amountAfter2014))}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                  <h3 className="font-bold text-gray-800 mb-6 text-center print:text-left">Biểu đồ tỷ trọng tiền BHXH theo giai đoạn đóng</h3>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hướng dẫn chi tiết cách tính Bảo Hiểm Xã Hội 1 lần</h2>
          <p className="mb-4">Người lao động tham gia BHXH bắt buộc sau 01 năm nghỉ việc, hoặc tham gia BHXH tự nguyện sau 01 năm không tiếp tục đóng mà chưa đủ 20 năm đóng BHXH thì có yêu cầu sẽ được giải quyết hưởng BHXH một lần...</p>
        </article>
      </div>
    </div>
  );
}