"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ (Cập nhật 2026)
// ==========================================
const CONFIG = {
  REGION_MIN_WAGE: {
    1: 5310000,
    2: 4730000,
    3: 4140000,
    4: 3700000,
  }
};

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function UnemploymentBenefitCalculator() {
  const [avgSalary, setAvgSalary] = useState<string>("15000000");
  const [years, setYears] = useState<string>("4");
  const [months, setMonths] = useState<string>("6");
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedSalary = localStorage.getItem('unemp_salary');
    const savedYears = localStorage.getItem('unemp_years');
    const savedMonths = localStorage.getItem('unemp_months');
    const savedRegion = localStorage.getItem('unemp_region');
    
    if (savedSalary) setAvgSalary(savedSalary);
    if (savedYears) setYears(savedYears);
    if (savedMonths) setMonths(savedMonths);
    if (savedRegion) setRegion(Number(savedRegion) as 1 | 2 | 3 | 4);
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation Logic (Luật Việc làm) ---
  const result = useMemo(() => {
    const salary = parseFloat(avgSalary.replace(/\D/g, '')) || 0;
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const totalMonthsPaid = y * 12 + m;

    let benefitMonths = 0;
    let unusedMonths = 0;

    // Tính số tháng được hưởng BHTN
    if (totalMonthsPaid >= 12 && totalMonthsPaid <= 36) {
      benefitMonths = 3;
      unusedMonths = totalMonthsPaid - 36 > 0 ? totalMonthsPaid - 36 : 0;
    } else if (totalMonthsPaid > 36) {
      const extraYears = Math.floor((totalMonthsPaid - 36) / 12);
      benefitMonths = Math.min(12, 3 + extraYears);
      
      // Số tháng lẻ chưa được tính để bảo lưu
      if (benefitMonths < 12) {
        unusedMonths = totalMonthsPaid - (36 + extraYears * 12);
      } else {
        // Nếu đã kịch trần 12 tháng, toàn bộ số tháng thừa còn lại được bảo lưu
        unusedMonths = totalMonthsPaid - 144; 
        if (unusedMonths < 0) unusedMonths = 0;
      }
    }

    // Tính mức hưởng hàng tháng (60% bình quân lương 6 tháng cuối)
    const rawMonthlyBenefit = salary * 0.6;
    
    // Áp dụng trần tối đa (Không quá 5 lần lương tối thiểu vùng)
    const maxCap = CONFIG.REGION_MIN_WAGE[region] * 5;
    const isCapped = rawMonthlyBenefit > maxCap;
    const monthlyBenefit = Math.min(rawMonthlyBenefit, maxCap);

    const totalBenefit = monthlyBenefit * benefitMonths;

    // Dữ liệu cho biểu đồ
    const chartData = [];
    for (let i = 1; i <= benefitMonths; i++) {
      chartData.push({
        month: `Tháng ${i}`,
        amount: monthlyBenefit
      });
    }

    return { 
      totalMonthsPaid, 
      benefitMonths, 
      monthlyBenefit, 
      totalBenefit, 
      isCapped, 
      maxCap,
      unusedMonths,
      chartData 
    };
  }, [avgSalary, years, months, region]);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Trợ Cấp Thất Nghiệp (BHTN)",
        "applicationCategory": "BusinessApplication",
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Tính Trợ Cấp Thất Nghiệp
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Dự tính chính xác mức hưởng BHTN hàng tháng và số tháng được lãnh bảo hiểm theo luật Việc làm mới nhất.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bình quân tiền lương đóng BHTN 6 tháng cuối (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={avgSalary} 
                    onChange={(e) => updateState(setAvgSalary, 'unemp_salary', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                  <p className="text-xs text-slate-400 mt-2">*Xem mức lương đóng BHTN trên ứng dụng VssID.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian đã đóng BHTN (Chưa hưởng)</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                        value={years} 
                        onChange={(e) => updateState(setYears, 'unemp_years', e.target.value)} 
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">Năm</span>
                    </div>
                    <div className="flex-1 relative">
                      <input type="number" min="0" max="11" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-center" 
                        value={months} 
                        onChange={(e) => updateState(setMonths, 'unemp_months', e.target.value)} 
                      />
                      <span className="absolute right-4 top-4 text-slate-400 font-medium">Tháng</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vùng áp dụng (Nơi cty đóng trụ sở)</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all appearance-none"
                    value={region} 
                    onChange={(e) => updateState(setRegion, 'unemp_region', Number(e.target.value))}
                  >
                    <option value={1}>Vùng I (Tối đa {formatCurrency(CONFIG.REGION_MIN_WAGE[1] * 5)}đ/tháng)</option>
                    <option value={2}>Vùng II (Tối đa {formatCurrency(CONFIG.REGION_MIN_WAGE[2] * 5)}đ/tháng)</option>
                    <option value={3}>Vùng III (Tối đa {formatCurrency(CONFIG.REGION_MIN_WAGE[3] * 5)}đ/tháng)</option>
                    <option value={4}>Vùng IV (Tối đa {formatCurrency(CONFIG.REGION_MIN_WAGE[4] * 5)}đ/tháng)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 print:hidden">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💼</span>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm mb-1">Nâng cấp bản thân trong thời gian rảnh</h4>
                    <p className="text-xs md:text-sm text-blue-700/80 leading-relaxed font-medium">
                      Thời gian nhận BHTN là cơ hội tuyệt vời để bạn làm mới CV và học thêm các kỹ năng chuyên môn. Đừng quên nộp hồ sơ BHTN trong vòng 3 tháng kể từ ngày chấm dứt HĐLĐ!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              
              {/* BOX SMART RESULT */}
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 print:border">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-4 relative z-10 print:text-slate-600 text-violet-400">
                  TỔNG SỐ TIỀN TRỢ CẤP ĐƯỢC NHẬN
                </h3>
                
                {result.totalMonthsPaid < 12 ? (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 relative z-10 print:bg-slate-100 print:border-none print:text-black">
                    <div className="text-xl font-bold text-rose-400 mb-2">Chưa đủ điều kiện hưởng BHTN</div>
                    <p className="text-sm text-rose-200/80">Bạn cần đóng BHTN đủ từ 12 tháng trở lên trong vòng 24 tháng trước khi chấm dứt hợp đồng lao động để đủ điều kiện hưởng trợ cấp.</p>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 relative z-10 break-words print:text-black text-white">
                      {formatCurrency(result.totalBenefit)} <span className="text-xl md:text-2xl font-bold opacity-60">đ</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-slate-700/50 relative z-10 print:border-slate-200">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Mức hưởng mỗi tháng</div>
                        <div className="text-2xl md:text-3xl font-bold text-white print:text-slate-800 break-words">{formatCurrency(result.monthlyBenefit)} <span className="text-sm font-normal text-slate-400">đ/tháng</span></div>
                        {result.isCapped && (
                          <div className="text-[10px] md:text-xs text-rose-400 mt-2 flex items-center gap-1">
                            ⚠️ Đã áp dụng trần tối đa vùng {region}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-2 text-slate-400">Thời gian nhận</div>
                        <div className="text-2xl md:text-3xl font-bold text-violet-400 print:text-slate-800">{result.benefitMonths} <span className="text-sm font-normal text-slate-400">tháng</span></div>
                      </div>
                    </div>

                    {result.unusedMonths > 0 && (
                      <div className="mt-6 text-xs md:text-sm text-emerald-400 font-medium relative z-10 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 inline-block">
                        💡 Bạn còn {result.unusedMonths} tháng đóng BHTN lẻ sẽ được bảo lưu cho lần nhận trợ cấp tiếp theo.
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* KHỐI BIỂU ĐỒ */}
              {result.totalMonthsPaid >= 12 && (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-8 shadow-sm flex flex-col justify-center print:hidden min-h-[350px]">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-6 text-center">Lộ trình nhận trợ cấp thất nghiệp</h3>
                  <div className="h-56 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 'dataMax']} />
                        <Tooltip 
                          formatter={(value: number) => `${formatCurrency(value)} đ`} 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                        />
                        <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={60}>
                          {result.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 text-center px-4">*Kèm theo khoản trợ cấp tiền mặt, bạn còn được cấp Thẻ Bảo Hiểm Y Tế (BHYT) miễn phí trong suốt thời gian hưởng trợ cấp.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TIME-ON-SITE
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 text-center">Lộ Trình Hưởng Trợ Cấp Thất Nghiệp (BHTN)</h2>
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-10 md:space-y-12 pb-4 md:pb-8">
              
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-rose-500 flex items-center justify-center text-xs md:text-sm font-black text-rose-500">01</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Giới hạn vàng: 3 Tháng</h3>
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-700 leading-relaxed shadow-sm">
                  Trong thời hạn <strong>03 tháng</strong> kể từ ngày chấm dứt hợp đồng lao động, bạn PHẢI nộp hồ sơ hưởng trợ cấp thất nghiệp tại Trung tâm Dịch vụ việc làm. Nếu quá 3 tháng, thời gian đóng BHTN sẽ tự động được bảo lưu, bạn không được nhận tiền đợt này nữa.
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-200 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">02</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Chuẩn bị hồ sơ nộp</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span>▪️</span> <span>Sổ BHXH gốc (đã chốt).</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span>Quyết định nghỉ việc / Quyết định sa thải / Hợp đồng lao động hết hạn (Bản chính hoặc bản sao công chứng).</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span>CCCD gắn chip.</span></li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-violet-600 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-white flex items-center justify-center text-xs md:text-sm font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">03</div>
                <h3 className="text-lg md:text-xl font-bold text-violet-600 mb-2 md:mb-3">Khai báo tình trạng việc làm hàng tháng</h3>
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-700 leading-relaxed shadow-sm">
                  Trong thời gian nhận tiền, hàng tháng bạn phải đến Trung tâm dịch vụ việc làm để thông báo về việc tìm kiếm việc làm (Theo ngày hẹn ghi trên phiếu). Trừ các trường hợp ốm đau có xác nhận của bệnh viện cấp huyện trở lên.
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Tự đơn phương nghỉ việc có được lãnh BHTN không?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Bạn <strong>VẪN ĐƯỢC</strong> lãnh BHTN nếu bạn đơn phương chấm dứt hợp đồng lao động ĐÚNG PHÁP LUẬT (báo trước 30 ngày đối với HĐ xác định thời hạn, hoặc 45 ngày đối với HĐ không xác định thời hạn). Trường hợp đơn phương nghỉ việc trái pháp luật (nghỉ ngang không báo trước) sẽ KHÔNG được hưởng BHTN.
                </div>
              </details>
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Trần tối đa trợ cấp thất nghiệp là bao nhiêu?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  <p>Mức hưởng hàng tháng được tính bằng 60% mức bình quân tiền lương tháng đóng BHTN của 6 tháng liền kề trước khi thất nghiệp. Tuy nhiên, mức này bị khống chế tối đa <strong>không quá 5 lần mức lương tối thiểu vùng</strong> do Chính phủ quy định.</p>
                  <p className="mt-2 text-xs">Ví dụ: Vùng I (Hà Nội, TPHCM) có lương tối thiểu là 5.310.000đ. Thì mức trợ cấp tối đa bạn có thể nhận được là: 5.310.000 x 5 = 26.550.000 đ/tháng.</p>
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