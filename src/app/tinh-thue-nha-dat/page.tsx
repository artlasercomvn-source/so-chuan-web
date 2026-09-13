"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// 1. THUẬT TOÁN LUẬT ĐẤT ĐAI & THUẾ (Chuẩn 2026)
// ==========================================
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// Tính phí công chứng (Phân bậc theo Thông tư 257/2016/TT-BTC)
const calculateNotaryFee = (value: number) => {
  if (value <= 50_000_000) return 50000;
  if (value <= 100_000_000) return 100000;
  if (value <= 1_000_000_000) return value * 0.001; // 0.1%
  if (value <= 3_000_000_000) return 1000000 + (value - 1_000_000_000) * 0.0006;
  if (value <= 5_000_000_000) return 2200000 + (value - 3_000_000_000) * 0.0005;
  if (value <= 10_000_000_000) return 3200000 + (value - 5_000_000_000) * 0.0004;
  if (value <= 100_000_000_000) return 5200000 + (value - 10_000_000_000) * 0.0003;
  
  // Trên 100 tỷ (Tối đa không quá 70 triệu)
  const maxFee = 32200000 + (value - 100_000_000_000) * 0.0002;
  return Math.min(maxFee, 70_000_000);
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function RealEstateTaxCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>("3500000000");
  const [isExemptTNCN, setIsExemptTNCN] = useState<boolean>(false);

  // --- Smart Memory ---
  useEffect(() => {
    const savedVal = localStorage.getItem('re_val');
    const savedExempt = localStorage.getItem('re_exempt');
    if (savedVal) setPropertyValue(savedVal);
    if (savedExempt) setIsExemptTNCN(savedExempt === 'true');
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation ---
  const result = useMemo(() => {
    const val = parseFloat(propertyValue.replace(/\D/g, '')) || 0;
    if (val === 0) return null;

    // 1. Thuế TNCN (2% giá trị chuyển nhượng, trừ khi được miễn)
    const taxTNCN = isExemptTNCN ? 0 : val * 0.02;

    // 2. Lệ phí trước bạ (0.5% giá trị, tối đa 500 triệu/tài sản)
    const lptb = Math.min(val * 0.005, 500_000_000);

    // 3. Phí công chứng (Theo thang bậc)
    const notaryFee = calculateNotaryFee(val);

    // 4. Phí thẩm định hồ sơ (0.15% giá trị, từ 100k đến 5 triệu)
    const appraisalFee = Math.min(Math.max(val * 0.0015, 100_000), 5_000_000);

    // 5. Lệ phí cấp sổ (Quy định cứng từng tỉnh, thường lấy trung bình 500k)
    const certificateFee = 500_000;

    const totalFee = taxTNCN + lptb + notaryFee + appraisalFee + certificateFee;

    const breakdown = [
      { name: 'Thuế Thu nhập cá nhân (2%)', value: taxTNCN, color: CHART_COLORS[0] },
      { name: 'Lệ phí trước bạ (0.5%)', value: lptb, color: CHART_COLORS[1] },
      { name: 'Phí công chứng Hợp đồng', value: notaryFee, color: CHART_COLORS[2] },
      { name: 'Phí thẩm định & Cấp sổ', value: appraisalFee + certificateFee, color: CHART_COLORS[3] }
    ].filter(item => item.value > 0);

    return { val, taxTNCN, lptb, notaryFee, appraisalFee, certificateFee, totalFee, breakdown };
  }, [propertyValue, isExemptTNCN]);

  return (
    <>
      <main className="bg-slate-50 min-h-screen pb-16 font-sans">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Trang chủ
            </a>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Thuế & Lệ Phí Nhà Đất
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Bóc tách chính xác đến từng đồng chi phí sang tên sổ đỏ, bao gồm Thuế TNCN, Lệ phí trước bạ và Phí công chứng bậc thang.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            {/* NHẬP LIỆU */}
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá trị chuyển nhượng thực tế (VNĐ)</label>
                  <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-3xl text-cyan-700 focus:ring-4 focus:ring-cyan-100 outline-none transition-all shadow-inner text-center" 
                    value={propertyValue} 
                    onChange={(e) => updateState(setPropertyValue, 're_val', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                  <p className="text-[11px] text-slate-400 mt-2">*Giá trị ghi trên Hợp đồng công chứng. Trường hợp giá này thấp hơn Khung giá đất nhà nước, Cơ quan thuế sẽ áp dụng Khung giá nhà nước.</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-center cursor-pointer p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500" 
                      checked={isExemptTNCN} onChange={(e) => updateState(setIsExemptTNCN, 're_exempt', e.target.checked)} />
                    <div className="ml-3">
                      <span className="block text-sm font-bold text-slate-800">Miễn Thuế TNCN (2%)</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Áp dụng khi bán BĐS duy nhất, hoặc chuyển nhượng giữa vợ chồng, cha mẹ và con cái.</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* KẾT QUẢ */}
            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              {result && (
                <>
                  <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-cyan-400 relative z-10">TỔNG THUẾ & PHÍ PHẢI NỘP</h3>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 relative z-10 break-words text-white">
                      {formatCurrency(result.totalFee)} <span className="text-2xl font-bold opacity-60">đ</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="h-48 w-full md:w-[45%] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={result.breakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                            {result.breakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${formatCurrency(value)} đ`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-[55%] flex flex-col gap-3">
                      {result.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-xs font-bold text-slate-700">{item.name}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* SEO & CROSS-SELL */}
      <article className="bg-white border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Hoàn Thiện Nhà Mới - Nâng Tầm Không Gian Sống</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Sau khi hoàn tất thủ tục sang tên đổi chủ, việc tiếp theo của đại đa số gia chủ là cải tạo, xây dựng hoặc hoàn thiện lại không gian sống để đón sinh khí mới.
              </p>
              <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-2xl">
                <span className="text-xl mb-2 block">✨</span>
                <p className="text-sm text-cyan-800 font-medium leading-relaxed">
                  Trong quy hoạch kiến trúc, hạng mục cơ khí như <strong>Cổng, Cửa, Lan can ban công, hay Cầu thang sắt nghệ thuật</strong> không chỉ bảo vệ an ninh mà còn là "bộ mặt" định hình đẳng cấp của ngôi nhà. Đừng quên phân bổ một phần ngân sách hợp lý để tìm kiếm đơn vị gia công cơ khí uy tín, giúp tài sản của bạn tăng giá trị thẩm mỹ lên gấp nhiều lần.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}