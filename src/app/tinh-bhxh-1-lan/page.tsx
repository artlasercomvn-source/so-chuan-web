"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ 
// ==========================================
const INFLATION_RATE: Record<number, number> = {
  2001: 3.81, 2002: 3.94, 2003: 4.09, 2004: 4.07, 2005: 4.01,
  2006: 3.54, 2007: 3.27, 2008: 3.05, 2009: 2.29, 2010: 2.81,
  2011: 2.14, 2012: 1.98, 2013: 1.85, 2014: 1.51, 2015: 1.42,
  2016: 1.38, 2017: 1.38, 2018: 1.32, 2019: 1.28, 2020: 1.23,
  2021: 1.20, 2022: 1.18, 2023: 1.14, 2024: 1.11, 2025: 1.07, 2026: 1.0
};

const CHART_COLORS = ['#f59e0b', '#3b82f6']; // Cam (Trước 2014) - Xanh (Sau 2014)

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
  // --- Quản lý State ---
  const [periods, setPeriods] = useState<Period[]>([
    { id: '1', fromMonth: '01', fromYear: '2018', toMonth: '12', toYear: '2022', salary: '15000000' }
  ]);

  // --- Các hàm thao tác với Giai đoạn ---
  const addPeriod = () => { 
    setPeriods([...periods, { id: Date.now().toString(), fromMonth: '', fromYear: '', toMonth: '', toYear: '', salary: '' }]); 
  };
  
  const removePeriod = (id: string) => { 
    if (periods.length > 1) setPeriods(periods.filter(p => p.id !== id)); 
  };
  
  const updatePeriod = (id: string, field: keyof Period, value: string) => { 
    setPeriods(periods.map(p => p.id === id ? { ...p, [field]: value } : p)); 
  };

  // --- Thuật toán Core ---
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
    
    // Xử lý làm tròn số tháng
    const yearsBefore2014 = Math.floor(totalMonthsBefore2014 / 12);
    const monthsLeftBefore = totalMonthsBefore2014 % 12;
    
    const totalMonthsAfterIncludingLeftover = totalMonthsAfter2014 + monthsLeftBefore;
    let yearsAfter2014 = Math.floor(totalMonthsAfterIncludingLeftover / 12);
    const monthsLeftAfter = totalMonthsAfterIncludingLeftover % 12;

    let roundedYearsAfter = yearsAfter2014;
    if (monthsLeftAfter >= 1 && monthsLeftAfter <= 6) roundedYearsAfter += 0.5;
    else if (monthsLeftAfter >= 7 && monthsLeftAfter <= 11) roundedYearsAfter += 1;

    const payoutBefore = yearsBefore2014 * 1.5 * averageSalary;
    const payoutAfter = roundedYearsAfter * 2 * averageSalary;
    const totalPayout = payoutBefore + payoutAfter;

    return { totalMonths: totalValidMonths, averageSalary, payoutBefore, payoutAfter, totalPayout };
  }, [periods]);

  // --- Chuẩn bị Dữ liệu Biểu đồ ---
  const chartData = [
    { name: 'Tiền trước 2014', value: result.payoutBefore },
    { name: 'Tiền từ 2014 trở đi', value: result.payoutAfter }
  ].filter(item => item.value > 0);

  const handlePrint = () => window.print();

  // --- Cấu trúc dữ liệu JSON-LD ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Bảo hiểm xã hội 1 lần",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Hệ số trượt giá BHXH là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Là chỉ số lạm phát do Nhà nước công bố hàng năm để nhân bù đắp vào mức lương đóng BHXH các năm trước của người lao động, đảm bảo không bị thiệt thòi khi nhận tiền." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
        
        {/* NAV & HEADER */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
            Quay lại trang chủ
          </a>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
            In báo cáo / Lưu PDF
          </button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Tính Bảo Hiểm Xã Hội 1 Lần</h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Hệ thống tự động áp dụng hệ số trượt giá và phân tách chặng đóng trước/sau năm 2014 theo quy định mới nhất của Pháp luật.</p>
        </header>

        {/* KHU VỰC TÍNH TOÁN */}
        <div className="flex flex-col xl:flex-row gap-8 mb-16">
          
          {/* CỘT TRÁI: NHẬP LIỆU GIAI ĐOẠN */}
          <section className="w-full xl:w-[55%] bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 print:border-none print:shadow-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-xl tracking-tight">Quá trình đóng BHXH</h3>
              <button onClick={addPeriod} className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors print:hidden flex items-center gap-2">
                <span className="text-lg">+</span> Thêm giai đoạn
              </button>
            </div>
            
            <div className="space-y-5 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 print:max-h-none print:overflow-visible">
              {periods.map((period, index) => (
                <div key={period.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group transition-colors hover:border-blue-200">
                  <div className="absolute top-5 right-5 print:hidden">
                    {periods.length > 1 && (
                      <button onClick={() => removePeriod(period.id)} className="text-rose-400 hover:text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors">
                        Xóa
                      </button>
                    )}
                  </div>
                  
                  <div className="text-sm font-black text-slate-400 mb-4 uppercase tracking-wider">Giai đoạn {index + 1}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Từ (Tháng / Năm)</label>
                      <div className="flex gap-3">
                        <input type="text" placeholder="MM" className="w-1/3 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium" 
                          value={period.fromMonth} onChange={(e) => updatePeriod(period.id, 'fromMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                        <input type="text" placeholder="YYYY" className="w-2/3 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium" 
                          value={period.fromYear} onChange={(e) => updatePeriod(period.id, 'fromYear', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Đến (Tháng / Năm)</label>
                      <div className="flex gap-3">
                        <input type="text" placeholder="MM" className="w-1/3 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium" 
                          value={period.toMonth} onChange={(e) => updatePeriod(period.id, 'toMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                        <input type="text" placeholder="YYYY" className="w-2/3 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center font-medium" 
                          value={period.toYear} onChange={(e) => updatePeriod(period.id, 'toYear', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mức lương đóng (VNĐ)</label>
                    <input type="text" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-lg text-slate-800 transition-all shadow-inner" 
                      value={period.salary} 
                      onChange={(e) => updatePeriod(period.id, 'salary', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CỘT PHẢI: KẾT QUẢ & BIỂU ĐỒ */}
          <section className="w-full xl:w-[45%] flex flex-col gap-6">
            
            {/* Box Chiết Tính */}
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-8 print:bg-white print:text-black print:border">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Báo Cáo Chiết Tính Rút BHXH</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-800 print:border-slate-200">
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Tổng thời gian</div>
                  <div className="text-2xl font-bold text-white print:text-black">{Math.floor(result.totalMonths / 12)} năm {result.totalMonths % 12} tháng</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Lương BQ (Nhân trượt giá)</div>
                  <div className="text-2xl font-bold text-blue-400">{formatCurrency(result.averageSalary)}đ</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800 print:border-slate-200">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Tiền BHXH trước 2014</span><span className="font-bold text-slate-200 print:text-slate-700">{formatCurrency(result.payoutBefore)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Tiền BHXH từ 2014 trở đi</span><span className="font-bold text-slate-200 print:text-slate-700">{formatCurrency(result.payoutAfter)}đ</span></div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-900/50 print:bg-slate-100 print:shadow-none print:text-black">
                <div className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider print:text-slate-600">Tổng Tiền 1 Lần Nhận Được</div>
                <div className="text-4xl md:text-5xl font-black text-white print:text-black">{formatCurrency(result.totalPayout)}đ</div>
              </div>
              
              <p className="mt-5 text-xs text-slate-500 text-center leading-relaxed">
                *Kết quả đã bao gồm hệ số trượt giá cập nhật. Các trường hợp lẻ tháng được làm tròn theo quy định của BHXH Việt Nam.
              </p>
            </div>

            {/* Box Biểu Đồ (Render khi có dữ liệu) */}
            {result.totalPayout > 0 && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm print:hidden h-72 flex flex-col justify-center items-center">
                <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-2 uppercase self-start">Tỷ trọng tiền nhận được</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ==========================================
          4. KHU VỰC NỘI DUNG SEO (Tối ưu EEAT & Light Theme)
          - Cấu trúc Grid, hạn chế đoạn văn dài, thân thiện Mobile.
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Bảng hệ số trượt giá BHXH mới nhất</h2>
            <div className="overflow-hidden bg-white shadow-sm border border-slate-200 rounded-2xl">
              <table className="w-full text-center text-sm md:text-base">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black">
                    <th className="p-4 border-b border-slate-200">Năm đóng</th>
                    <th className="p-4 border-b border-slate-200 border-l">Hệ số</th>
                    <th className="p-4 border-b border-slate-200 border-l">Năm đóng</th>
                    <th className="p-4 border-b border-slate-200 border-l">Hệ số</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100">Trước 2015</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">&gt; 1.42</td>
                    <td className="p-4 border-b border-slate-100 border-l">2021</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.20</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100">2018</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.32</td>
                    <td className="p-4 border-b border-slate-100 border-l">2022</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.18</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100">2019</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.28</td>
                    <td className="p-4 border-b border-slate-100 border-l">2023</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.14</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100">2020</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.23</td>
                    <td className="p-4 border-b border-slate-100 border-l">2024</td>
                    <td className="p-4 border-b border-slate-100 border-l text-blue-600 font-bold">1.11</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-3 font-medium">
              * Hệ số trượt giá đã được hệ thống máy tính tự động nhân vào kết quả chiết tính phía trên.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Hồ sơ & Thủ tục chuẩn bị rút BHXH</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2">
                <span className="text-3xl">📄</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Sổ BHXH gốc</h3>
                <p className="text-slate-600 leading-relaxed">Cần nộp sổ gốc đã được công ty chốt (bao gồm tờ bìa và các tờ rời đính kèm).</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2">
                <span className="text-3xl">🪪</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">CCCD gắn chip</h3>
                <p className="text-slate-600 leading-relaxed">Căn cước công dân bản chính để nhân viên cơ quan BHXH đối chiếu thông tin.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2">
                <span className="text-3xl">🏦</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Tài khoản ngân hàng</h3>
                <p className="text-slate-600 leading-relaxed">Phải là số tài khoản chính chủ của bạn để nhận tiền giải ngân qua chuyển khoản.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-2">
                <span className="text-3xl">📱</span>
                <h3 className="font-bold text-slate-800 text-lg mt-2">Ứng dụng VssID</h3>
                <p className="text-slate-600 leading-relaxed">Nên cài đặt sẵn ứng dụng VssID trên điện thoại để tra cứu nhanh quá trình đóng nếu cần.</p>
              </div>

            </div>
          </section>

          {/* KHỐI LIÊN HỆ */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Liên hệ Tư vấn & Cơ quan BHXH</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-400">Nếu bạn gặp khó khăn trong việc làm thủ tục hoặc tính toán quá trình đóng phức tạp, đội ngũ "Số Chuẩn" luôn sẵn sàng hỗ trợ.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3 items-center">📍 <span>Trụ sở chính: Quận Đống Đa, Hà Nội, Việt Nam</span></li>
                  <li className="flex gap-3 items-center">📞 <span>Hotline: 1900.xxxx</span></li>
                  <li className="flex gap-3 items-center">✉️ <span>Email: contact@sochuan.vn</span></li>
                </ul>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-4 transition-colors w-full md:w-auto shadow-lg shadow-blue-900/50">
                  Tư vấn rút BHXH miễn phí
                </button>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.095593888365!2d105.8239019!3d21.0288602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab748a044321%3A0x6b3017a61d6706e!2zxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ định vị BHXH">
                </iframe>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Style tùy chỉnh cho thanh cuộn hộp nhập liệu */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}