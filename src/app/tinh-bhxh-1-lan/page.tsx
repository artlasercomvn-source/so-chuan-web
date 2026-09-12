"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH HỆ SỐ TRƯỢT GIÁ (LẠM PHÁT)
// ==========================================
const INFLATION_RATE: Record<number, number> = {
  2001: 3.81, 2002: 3.94, 2003: 4.09, 2004: 4.07, 2005: 4.01,
  2006: 3.54, 2007: 3.27, 2008: 3.05, 2009: 2.29, 2010: 2.81,
  2011: 2.14, 2012: 1.98, 2013: 1.85, 2014: 1.51, 2015: 1.42,
  2016: 1.38, 2017: 1.38, 2018: 1.32, 2019: 1.28, 2020: 1.23,
  2021: 1.20, 2022: 1.18, 2023: 1.14, 2024: 1.11, 2025: 1.07, 2026: 1.0
};

const CHART_COLORS = ['#f59e0b', '#3b82f6']; // Cam (Trước 2014) - Xanh (Từ 2014)

interface Period { 
  id: string; 
  fromMonth: string; 
  fromYear: string; 
  toMonth: string; 
  toYear: string; 
  salary: string; 
}

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function SocialInsuranceCalculator() {
  const [periods, setPeriods] = useState<Period[]>([
    { id: '1', fromMonth: '01', fromYear: '2018', toMonth: '12', toYear: '2022', salary: '15000000' }
  ]);

  const addPeriod = () => { 
    setPeriods([...periods, { id: Date.now().toString(), fromMonth: '', fromYear: '', toMonth: '', toYear: '', salary: '' }]); 
  };
  
  const removePeriod = (id: string) => { 
    if (periods.length > 1) setPeriods(periods.filter(p => p.id !== id)); 
  };
  
  const updatePeriod = (id: string, field: keyof Period, value: string) => { 
    setPeriods(periods.map(p => p.id === id ? { ...p, [field]: value } : p)); 
  };

  // Thuật toán tính toán chuẩn Luật BHXH
  const result = useMemo(() => {
    let totalMonthsBefore2014 = 0; 
    let totalMonthsAfter2014 = 0; 
    let totalAdjustedSalary = 0; 
    let totalValidMonths = 0;

    periods.forEach(p => {
      const fM = parseInt(p.fromMonth) || 0; 
      const fY = parseInt(p.fromYear) || 0;
      const tM = parseInt(p.toMonth) || 0; 
      const tY = parseInt(p.toYear) || 0;
      const sal = parseInt(p.salary.replace(/,/g, '')) || 0;

      if (fM && fY && tM && tY && sal) {
        for (let y = fY; y <= tY; y++) {
          const startMonth = (y === fY) ? fM : 1; 
          const endMonth = (y === tY) ? tM : 12;
          const monthsInYear = endMonth - startMonth + 1;
          
          if (monthsInYear > 0) {
            const inflation = INFLATION_RATE[y] || 1.0;
            totalAdjustedSalary += (sal * inflation * monthsInYear);
            totalValidMonths += monthsInYear;
            
            if (y < 2014) totalMonthsBefore2014 += monthsInYear; 
            else totalMonthsAfter2014 += monthsInYear;
          }
        }
      }
    });

    const averageSalary = totalValidMonths > 0 ? totalAdjustedSalary / totalValidMonths : 0;
    
    // Xử lý chuyển tháng lẻ trước 2014 sang sau 2014 theo đúng luật
    const yearsBefore2014 = Math.floor(totalMonthsBefore2014 / 12);
    const monthsLeftBefore = totalMonthsBefore2014 % 12;
    
    const totalMonthsAfterIncludingLeftover = totalMonthsAfter2014 + monthsLeftBefore;
    let yearsAfter2014 = Math.floor(totalMonthsAfterIncludingLeftover / 12);
    const monthsLeftAfter = totalMonthsAfterIncludingLeftover % 12;

    // Quy tắc làm tròn
    let roundedYearsAfter = yearsAfter2014;
    if (monthsLeftAfter >= 1 && monthsLeftAfter <= 6) roundedYearsAfter += 0.5;
    else if (monthsLeftAfter >= 7 && monthsLeftAfter <= 11) roundedYearsAfter += 1;

    const payoutBefore = yearsBefore2014 * 1.5 * averageSalary;
    const payoutAfter = roundedYearsAfter * 2 * averageSalary;
    const totalPayout = payoutBefore + payoutAfter;

    return { totalMonths: totalValidMonths, averageSalary, payoutBefore, payoutAfter, totalPayout };
  }, [periods]);

  const chartData = [
    { name: 'Tiền trước 2014', value: result.payoutBefore },
    { name: 'Tiền từ 2014 trở đi', value: result.payoutAfter }
  ].filter(item => item.value > 0);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Bảo hiểm xã hội 1 lần",
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Tính Bảo Hiểm Xã Hội 1 Lần</h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">Hệ thống tự động áp dụng hệ số trượt giá và phân tách chặng đóng trước/sau năm 2014 theo quy định mới nhất của Pháp luật.</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            {/* CỘT TRÁI: NHẬP LIỆU GIAI ĐOẠN */}
            <section className="w-full xl:w-[55%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 print:border-none print:shadow-none h-fit">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">Quá trình đóng BHXH</h3>
                <button onClick={addPeriod} className="bg-blue-50 text-blue-600 font-bold px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm hover:bg-blue-100 transition-colors print:hidden flex items-center gap-1.5 shrink-0">
                  <span className="text-base md:text-lg">+</span> Thêm
                </button>
              </div>
              
              <div className="space-y-5 max-h-[600px] overflow-y-auto custom-scrollbar pr-1 md:pr-2 print:max-h-none print:overflow-visible">
                {periods.map((period, index) => (
                  <div key={period.id} className="p-4 md:p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group transition-colors hover:border-blue-200">
                    <div className="absolute top-4 right-4 md:top-5 md:right-5 print:hidden">
                      {periods.length > 1 && (
                        <button onClick={() => removePeriod(period.id)} className="text-rose-400 hover:text-rose-600 font-bold text-xs md:text-sm bg-rose-50 hover:bg-rose-100 px-2 md:px-3 py-1 rounded-lg transition-colors">
                          Xóa
                        </button>
                      )}
                    </div>
                    
                    <div className="text-xs md:text-sm font-black text-slate-400 mb-4 uppercase tracking-wider">Giai đoạn {index + 1}</div>
                    
                    {/* Tối ưu Mobile: Xếp chồng input trên màn hình nhỏ */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-5">
                      <div className="flex-1">
                        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Từ (Tháng / Năm)</label>
                        <div className="flex gap-2 md:gap-3">
                          <input type="text" placeholder="MM" className="w-[30%] p-3 md:p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium text-sm md:text-base transition-all" 
                            value={period.fromMonth} onChange={(e) => updatePeriod(period.id, 'fromMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                          <input type="text" placeholder="YYYY" className="w-[70%] p-3 md:p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium text-sm md:text-base transition-all" 
                            value={period.fromYear} onChange={(e) => updatePeriod(period.id, 'fromYear', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Đến (Tháng / Năm)</label>
                        <div className="flex gap-2 md:gap-3">
                          <input type="text" placeholder="MM" className="w-[30%] p-3 md:p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium text-sm md:text-base transition-all" 
                            value={period.toMonth} onChange={(e) => updatePeriod(period.id, 'toMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                          <input type="text" placeholder="YYYY" className="w-[70%] p-3 md:p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium text-sm md:text-base transition-all" 
                            value={period.toYear} onChange={(e) => updatePeriod(period.id, 'toYear', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Mức lương đóng (VNĐ)</label>
                      <input type="text" className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-base md:text-lg text-slate-800 transition-all shadow-inner" 
                        value={period.salary} 
                        onChange={(e) => updatePeriod(period.id, 'salary', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
            <section className="w-full xl:w-[45%] flex flex-col gap-6">
              <div className="bg-slate-900 rounded-[2rem] shadow-xl p-5 md:p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                
                <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-400 mb-4 md:mb-6 uppercase relative z-10">Báo Cáo Chiết Tính Rút BHXH</h3>
                
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 md:p-8 shadow-2xl mb-6 md:mb-8 relative z-10 print:bg-slate-100 print:shadow-none print:text-black">
                  <div className="text-xs font-bold text-blue-200 mb-1 md:mb-2 uppercase tracking-wider print:text-slate-600">Tổng Tiền Nhận Được</div>
                  {/* Tối ưu chống tràn chữ trên màn nhỏ */}
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight break-words print:text-black">
                    {formatCurrency(result.totalPayout)} <span className="text-xl md:text-2xl font-bold opacity-70">VNĐ</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-4 md:pb-6 border-b border-slate-800 relative z-10 print:border-slate-200">
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Tổng thời gian</div>
                    <div className="text-lg md:text-2xl font-bold text-white print:text-black">{Math.floor(result.totalMonths / 12)} năm {result.totalMonths % 12} tháng</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Lương BQ (Trượt giá)</div>
                    <div className="text-lg md:text-2xl font-bold text-blue-400 break-words">{formatCurrency(result.averageSalary)}đ</div>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 relative z-10">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-medium">Tiền trước 2014</span>
                    <span className="font-bold text-slate-200 break-words print:text-slate-700">{formatCurrency(result.payoutBefore)}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-medium">Tiền từ 2014 trở đi</span>
                    <span className="font-bold text-slate-200 break-words print:text-slate-700">{formatCurrency(result.payoutAfter)}đ</span>
                  </div>
                </div>
                
                <p className="mt-6 text-[10px] md:text-xs text-slate-500 text-center leading-relaxed relative z-10 px-2">
                  *Kết quả đã tính hệ số lạm phát. Tháng lẻ được làm tròn theo quy định BHXH Việt Nam.
                </p>
              </div>

              {result.totalPayout > 0 && (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm print:hidden flex flex-col justify-center items-center">
                  <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-800 mb-4 uppercase self-start">Tỷ trọng tiền nhận được</h3>
                  <div className="h-48 md:h-52 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* ==========================================
          KHU VỰC NỘI DUNG SEO & TIME-ON-SITE (KHÔNG BẢN ĐỒ)
          ========================================== */}
      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Bảng hệ số trượt giá BHXH mới nhất</h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed text-center max-w-2xl mx-auto">
              Hệ số trượt giá (lạm phát) được hệ thống tự động nhân với mức lương đóng BHXH của từng giai đoạn, đảm bảo tiền rút về không bị mất giá.
            </p>
            <div className="overflow-hidden bg-slate-50 shadow-sm border border-slate-200 rounded-[2rem]">
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm md:text-base whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black">
                      <th className="p-3 md:p-4 border-b border-slate-200">Năm đóng</th>
                      <th className="p-3 md:p-4 border-b border-slate-200 border-l">Hệ số</th>
                      <th className="p-3 md:p-4 border-b border-slate-200 border-l">Năm đóng</th>
                      <th className="p-3 md:p-4 border-b border-slate-200 border-l">Hệ số</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 font-medium">
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 md:p-4 border-b border-slate-100">Trước 2015</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">&gt; 1.42</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l">2021</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.20</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 md:p-4 border-b border-slate-100">2018</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.32</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l">2022</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.18</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 md:p-4 border-b border-slate-100">2019</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.28</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l">2023</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.14</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 md:p-4 border-b border-slate-100">2020</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.23</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l">2024</td>
                      <td className="p-3 md:p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.11</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 text-center">Lộ Trình Rút Tiền BHXH 1 Lần</h2>
            
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-10 md:space-y-12 pb-4 md:pb-8">
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-200 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">01</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Chuẩn bị hồ sơ đầy đủ</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>Sổ BHXH gốc:</strong> Đã chốt quá trình đóng (gồm tờ bìa và các tờ rời).</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>CCCD/CMND:</strong> Bản chính để xuất trình đối chiếu.</span></li>
                    <li className="flex items-start gap-2"><span>▪️</span> <span><strong>Đơn đề nghị:</strong> Mẫu 14-HSB (Xin trực tiếp tại cơ quan BHXH).</span></li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-slate-200 flex items-center justify-center text-xs md:text-sm font-black text-slate-400">02</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">Nộp hồ sơ trực tiếp</h3>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-600 leading-relaxed shadow-sm">
                  Đến trực tiếp cơ quan BHXH quận/huyện hoặc tỉnh/thành phố nơi bạn đang thường trú hoặc tạm trú. Lấy số thứ tự và nộp hồ sơ tại bộ phận Một cửa.
                </div>
              </div>

              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full -left-[17px] md:-left-[21px] top-0 border-4 border-white flex items-center justify-center text-xs md:text-sm font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">03</div>
                <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2 md:mb-3">Chờ duyệt & Nhận tiền</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-700 leading-relaxed shadow-sm">
                  Trong thời hạn tối đa <strong>05 ngày làm việc</strong> kể từ ngày nhận đủ hồ sơ hợp lệ, cơ quan BHXH sẽ giải quyết và chuyển tiền thẳng vào tài khoản ngân hàng của bạn.
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Làm tròn tháng lẻ khi tính tiền như thế nào?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Theo quy định, thời gian đóng BHXH có tháng lẻ từ <strong>1 đến 6 tháng</strong> được làm tròn thành nửa năm (0.5 năm). Nếu lẻ từ <strong>7 đến 11 tháng</strong> được làm tròn thành 1 năm để tính hệ số nhân.
                </div>
              </details>

              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Nghỉ việc bao lâu thì được rút tiền?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Người lao động tham gia BHXH bắt buộc sau <strong>01 năm nghỉ việc</strong> (12 tháng) mà chưa đủ điều kiện hưởng lương hưu và không tiếp tục đóng BHXH thì sẽ đủ điều kiện làm thủ tục rút 1 lần.
                </div>
              </details>
            </div>
          </section>

        </div>
      </article>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}