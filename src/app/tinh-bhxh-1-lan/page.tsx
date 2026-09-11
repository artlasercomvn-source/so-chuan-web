"use client";

import React, { useState, useMemo } from 'react';

const INFLATION_RATE: Record<number, number> = {
  2001: 3.81, 2002: 3.94, 2003: 4.09, 2004: 4.07, 2005: 4.01,
  2006: 3.54, 2007: 3.27, 2008: 3.05, 2009: 2.29, 2010: 2.81,
  2011: 2.14, 2012: 1.98, 2013: 1.85, 2014: 1.51, 2015: 1.42,
  2016: 1.38, 2017: 1.38, 2018: 1.32, 2019: 1.28, 2020: 1.23,
  2021: 1.20, 2022: 1.18, 2023: 1.14, 2024: 1.11, 2025: 1.07, 2026: 1.0
};
interface Period { id: string; fromMonth: string; fromYear: string; toMonth: string; toYear: string; salary: string; }

export default function SocialInsuranceCalculator() {
  const [periods, setPeriods] = useState<Period[]>([{ id: '1', fromMonth: '01', fromYear: '2018', toMonth: '12', toYear: '2022', salary: '15000000' }]);

  const addPeriod = () => { setPeriods([...periods, { id: Date.now().toString(), fromMonth: '', fromYear: '', toMonth: '', toYear: '', salary: '' }]); };
  const removePeriod = (id: string) => { if (periods.length > 1) { setPeriods(periods.filter(p => p.id !== id)); } };
  const updatePeriod = (id: string, field: keyof Period, value: string) => { setPeriods(periods.map(p => p.id === id ? { ...p, [field]: value } : p)); };

  const result = useMemo(() => {
    let totalMonthsBefore2014 = 0; let totalMonthsAfter2014 = 0; let totalAdjustedSalary = 0; let totalValidMonths = 0;

    periods.forEach(p => {
      const fM = parseInt(p.fromMonth) || 0; const fY = parseInt(p.fromYear) || 0;
      const tM = parseInt(p.toMonth) || 0; const tY = parseInt(p.toYear) || 0;
      const sal = parseInt(p.salary.replace(/,/g, '')) || 0;

      if (fM && fY && tM && tY && sal) {
        for (let y = fY; y <= tY; y++) {
          const startMonth = (y === fY) ? fM : 1; const endMonth = (y === tY) ? tM : 12;
          const monthsInYear = endMonth - startMonth + 1;
          if (monthsInYear > 0) {
            const inflation = INFLATION_RATE[y] || 1.0;
            totalAdjustedSalary += (sal * inflation * monthsInYear);
            totalValidMonths += monthsInYear;
            if (y < 2014) totalMonthsBefore2014 += monthsInYear; else totalMonthsAfter2014 += monthsInYear;
          }
        }
      }
    });

    const averageSalary = totalValidMonths > 0 ? totalAdjustedSalary / totalValidMonths : 0;
    let yearsBefore2014 = Math.floor(totalMonthsBefore2014 / 12);
    let monthsLeftBefore = totalMonthsBefore2014 % 12;
    let totalMonthsAfterIncludingLeftover = totalMonthsAfter2014 + monthsLeftBefore;
    let yearsAfter2014 = Math.floor(totalMonthsAfterIncludingLeftover / 12);
    let monthsLeftAfter = totalMonthsAfterIncludingLeftover % 12;

    let roundedYearsAfter = yearsAfter2014;
    if (monthsLeftAfter >= 1 && monthsLeftAfter <= 6) roundedYearsAfter += 0.5;
    else if (monthsLeftAfter >= 7 && monthsLeftAfter <= 11) roundedYearsAfter += 1;

    const payoutBefore = yearsBefore2014 * 1.5 * averageSalary;
    const payoutAfter = roundedYearsAfter * 2 * averageSalary;
    const totalPayout = payoutBefore + payoutAfter;

    return { totalMonths: totalValidMonths, averageSalary, payoutBefore, payoutAfter, totalPayout };
  }, [periods]);

  const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');
  const handlePrint = () => { window.print(); };

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
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <div className="mb-8 flex justify-between items-center print:hidden">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Quay lại trang chủ
          </a>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> In báo cáo / Lưu PDF
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center uppercase tracking-tight">Tính Bảo Hiểm Xã Hội 1 Lần</h1>
        <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">Tự động áp dụng hệ số trượt giá và phân tách chặng đóng trước/sau năm 2014 theo quy định mới nhất.</p>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-[55%] bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 print:border-none print:shadow-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Quá trình đóng BHXH</h3>
              <button onClick={addPeriod} className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors print:hidden">+ Thêm giai đoạn</button>
            </div>
            <div className="space-y-4">
              {periods.map((period, index) => (
                <div key={period.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">{periods.length > 1 && (<button onClick={() => removePeriod(period.id)} className="text-rose-400 hover:text-rose-600 font-bold text-sm">Xóa</button>)}</div>
                  <div className="text-sm font-bold text-slate-400 mb-3">Giai đoạn {index + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Từ (Tháng/Năm)</label><div className="flex gap-2"><input type="text" placeholder="MM" className="w-1/3 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center" value={period.fromMonth} onChange={(e) => updatePeriod(period.id, 'fromMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} /><input type="text" placeholder="YYYY" className="w-2/3 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center" value={period.fromYear} onChange={(e) => updatePeriod(period.id, 'fromYear', e.target.value.replace(/\D/g, '').slice(0, 4))} /></div></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Đến (Tháng/Năm)</label><div className="flex gap-2"><input type="text" placeholder="MM" className="w-1/3 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center" value={period.toMonth} onChange={(e) => updatePeriod(period.id, 'toMonth', e.target.value.replace(/\D/g, '').slice(0, 2))} /><input type="text" placeholder="YYYY" className="w-2/3 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center" value={period.toYear} onChange={(e) => updatePeriod(period.id, 'toYear', e.target.value.replace(/\D/g, '').slice(0, 4))} /></div></div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Mức lương đóng (VNĐ)</label><input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium" value={period.salary} onChange={(e) => updatePeriod(period.id, 'salary', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[45%]">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-8 print:bg-slate-900 print:text-white">
              <h3 className="text-lg font-semibold text-slate-400 mb-6">Báo Cáo Chiết Tính Rút BHXH</h3>
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-800">
                <div><div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Tổng thời gian</div><div className="text-xl font-bold text-white">{Math.floor(result.totalMonths / 12)} năm {result.totalMonths % 12} tháng</div></div>
                <div><div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Lương BQ (Nhân trượt giá)</div><div className="text-xl font-bold text-blue-400">{formatCurrency(result.averageSalary)}đ</div></div>
              </div>
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800">
                <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Tiền BHXH trước 2014</span><span className="font-bold text-slate-200">{formatCurrency(result.payoutBefore)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Tiền BHXH từ 2014 trở đi</span><span className="font-bold text-slate-200">{formatCurrency(result.payoutAfter)}đ</span></div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-inner border border-blue-500/50">
                <div className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider">Tổng Tiền 1 Lần Nhận Được</div>
                <div className="text-4xl md:text-5xl font-black text-white">{formatCurrency(result.totalPayout)}đ</div>
              </div>
              <p className="mt-4 text-xs text-slate-500 text-center">*Kết quả đã bao gồm hệ số trượt giá cập nhật. Các trường hợp lẻ tháng được làm tròn theo quy định của BHXH Việt Nam.</p>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG MỞ RỘNG (TẬP TRUNG SEO) */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Hệ số trượt giá BHXH mới nhất</h2>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Nhà nước công bố hệ số trượt giá (lạm phát) hàng năm để nhân bù đắp vào mức lương đóng BHXH các năm trước của bạn, đảm bảo bạn không bị thiệt thòi khi rút tiền.
            </p>
            <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-2xl">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold"><th className="p-3 border-b border-slate-700">Năm đóng</th><th className="p-3 border-b border-slate-700 border-l">Hệ số</th><th className="p-3 border-b border-slate-700 border-l">Năm đóng</th><th className="p-3 border-b border-slate-700 border-l">Hệ số</th></tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr><td className="p-3 border-b border-slate-700">Trước 2015</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">&gt; 1.42</td><td className="p-3 border-b border-slate-700 border-l">2021</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.20</td></tr>
                  <tr><td className="p-3 border-b border-slate-700">2018</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.32</td><td className="p-3 border-b border-slate-700 border-l">2022</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.18</td></tr>
                  <tr><td className="p-3 border-b border-slate-700">2019</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.28</td><td className="p-3 border-b border-slate-700 border-l">2023</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.14</td></tr>
                  <tr><td className="p-3 border-b border-slate-700">2020</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.23</td><td className="p-3 border-b border-slate-700 border-l">2024</td><td className="p-3 border-b border-slate-700 border-l text-blue-400">1.11</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Quy tắc tính chặng đóng trước và sau 2014</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Thời gian đóng trước 2014</h3>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Cứ mỗi năm đóng BHXH, người lao động được tính bằng <strong className="text-white">1.5 tháng</strong> mức bình quân tiền lương tháng đóng BHXH.
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">Thời gian đóng từ năm 2014</h3>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Cứ mỗi năm đóng BHXH, người lao động được tính bằng <strong className="text-white">2.0 tháng</strong> mức bình quân tiền lương tháng đóng BHXH.
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Hồ sơ cần chuẩn bị rút BHXH</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">📄</span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wide">Sổ BHXH gốc</p>
                <p className="text-xs text-slate-500 mt-1">Đã chốt (bản gốc kèm tờ rời)</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">🪪</span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wide">CCCD gắn chip</p>
                <p className="text-xs text-slate-500 mt-1">Bản gốc để xuất trình đối chiếu</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">🏦</span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wide">Tài khoản Ngân hàng</p>
                <p className="text-xs text-slate-500 mt-1">Chính chủ để nhận tiền giải ngân</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">📝</span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wide">Đơn đề nghị</p>
                <p className="text-xs text-slate-500 mt-1">Mẫu số 14-HSB (Có sẵn tại cơ quan)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}