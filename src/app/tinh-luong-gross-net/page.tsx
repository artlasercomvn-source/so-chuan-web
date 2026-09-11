"use client";

import React, { useState, useMemo } from 'react';

const LUONG_CO_SO = 2530000; 
const LUONG_TOI_THIEU_VUNG = { 1: 5310000, 2: 4730000, 3: 4140000, 4: 3700000 };
const GIAM_TRU_BAN_THAN = 11000000; 
const GIAM_TRU_NGUOI_PHU_THUOC = 4400000;

const TY_LE_BHXH = 0.08;
const TY_LE_BHYT = 0.015;
const TY_LE_BHTN = 0.01;

export default function GrossNetCalculator() {
  const [income, setIncome] = useState<string>('20000000');
  const [isGross, setIsGross] = useState<boolean>(true);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);
  const [insuranceType, setInsuranceType] = useState<'full' | 'custom'>('full');
  const [customInsurance, setCustomInsurance] = useState<string>('');
  const [dependents, setDependents] = useState<number>(0);

  const calculateTax = (taxableIncome: number) => {
    if (taxableIncome <= 0) return 0;
    if (taxableIncome <= 5000000) return taxableIncome * 0.05;
    if (taxableIncome <= 10000000) return taxableIncome * 0.1 - 250000;
    if (taxableIncome <= 18000000) return taxableIncome * 0.15 - 750000;
    if (taxableIncome <= 32000000) return taxableIncome * 0.2 - 1650000;
    if (taxableIncome <= 52000000) return taxableIncome * 0.25 - 3250000;
    if (taxableIncome <= 80000000) return taxableIncome * 0.3 - 5850000;
    return taxableIncome * 0.35 - 9850000;
  };

  const results = useMemo(() => {
    const rawIncome = parseInt(income.replace(/,/g, '')) || 0;
    const rawCustomIns = parseInt(customInsurance.replace(/,/g, '')) || 0;
    
    const tranBHXH = LUONG_CO_SO * 20;
    const tranBHTN = LUONG_TOI_THIEU_VUNG[region] * 20;

    let gross = 0;
    
    if (isGross) {
      gross = rawIncome;
    } else {
      let net = rawIncome;
      let estimatedGross = net;
      let loopCount = 0;
      let diff = 1000;
      
      while (Math.abs(diff) > 1 && loopCount < 50) {
        const insSalary = insuranceType === 'full' ? estimatedGross : rawCustomIns;
        const bhxh = Math.min(insSalary, tranBHXH) * TY_LE_BHXH;
        const bhyt = Math.min(insSalary, tranBHXH) * TY_LE_BHYT;
        const bhtn = Math.min(insSalary, tranBHTN) * TY_LE_BHTN;
        const totalIns = bhxh + bhyt + bhtn;
        
        const taxable = Math.max(0, estimatedGross - totalIns - GIAM_TRU_BAN_THAN - (dependents * GIAM_TRU_NGUOI_PHU_THUOC));
        const tax = calculateTax(taxable);
        
        const calculatedNet = estimatedGross - totalIns - tax;
        diff = net - calculatedNet;
        estimatedGross += diff;
        loopCount++;
      }
      gross = estimatedGross;
    }

    const insSalary = insuranceType === 'full' ? gross : rawCustomIns;
    const bhxh = Math.min(insSalary, tranBHXH) * TY_LE_BHXH;
    const bhyt = Math.min(insSalary, tranBHXH) * TY_LE_BHYT;
    const bhtn = Math.min(insSalary, tranBHTN) * TY_LE_BHTN;
    const totalIns = bhxh + bhyt + bhtn;

    const taxableIncome = Math.max(0, gross - totalIns - GIAM_TRU_BAN_THAN - (dependents * GIAM_TRU_NGUOI_PHU_THUOC));
    const personalTax = calculateTax(taxableIncome);
    const net = gross - totalIns - personalTax;

    return { gross, net, bhxh, bhyt, bhtn, totalIns, personalTax };
  }, [income, isGross, region, insuranceType, customInsurance, dependents]);

  const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

  const handlePrint = () => { window.print(); };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lương Gross sang Net chuẩn xác 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Lương Gross là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Lương Gross là tổng thu nhập mỗi tháng mà doanh nghiệp trả cho người lao động, bao gồm lương cơ bản và các khoản trợ cấp, phụ cấp, hoa hồng... nhưng chưa trừ các khoản bảo hiểm bắt buộc và thuế TNCN." }
          },
          {
            "@type": "Question",
            "name": "Lương Net là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Lương Net là số tiền thực nhận của người lao động sau khi đã trừ đi các khoản chi phí bảo hiểm (BHXH, BHYT, BHTN) và Thuế thu nhập cá nhân (nếu có)." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* KHU VỰC CÔNG CỤ TÍNH TOÁN */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
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

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center uppercase tracking-tight">
          Công Cụ Tính Lương Gross - Net 2026
        </h1>
        <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
          Chiết tính tự động dựa trên mức lương cơ sở 2.530.000đ và mức lương tối thiểu vùng mới nhất áp dụng theo Nghị định của Chính phủ.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 print:border-none print:shadow-none">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Thu nhập của bạn (VNĐ)</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={income} onChange={(e) => setIncome(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Mức lương đóng bảo hiểm</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={insuranceType === 'full'} onChange={() => setInsuranceType('full')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Đóng trên 100% lương chính thức</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={insuranceType === 'custom'} onChange={() => setInsuranceType('custom')} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Mức đóng khác (VNĐ):</span>
                </label>
                {insuranceType === 'custom' && (
                  <input type="text" className="p-3 bg-slate-50 border border-slate-200 rounded-xl ml-7 w-[calc(100%-1.75rem)] focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Nhập mức lương đóng bảo hiểm..." value={customInsurance} onChange={(e) => setCustomInsurance(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vùng áp dụng</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer" value={region} onChange={(e) => setRegion(Number(e.target.value) as 1|2|3|4)}>
                  <option value={1}>Vùng I</option>
                  <option value={2}>Vùng II</option>
                  <option value={3}>Vùng III</option>
                  <option value={4}>Vùng IV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Người phụ thuộc</label>
                <input type="number" min="0" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex gap-4 print:hidden">
              <button onClick={() => setIsGross(true)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${isGross ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>GROSS ➔ NET</button>
              <button onClick={() => setIsGross(false)} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${!isGross ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>NET ➔ GROSS</button>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-8 print:bg-slate-900 print:text-white">
              <h3 className="text-lg font-semibold text-slate-400 mb-6">Báo Cáo Chiết Tính Lương</h3>
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">LƯƠNG GROSS</div>
                  <div className="text-3xl font-black text-white">{formatCurrency(results.gross)}đ</div>
                </div>
              </div>
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm xã hội (8%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhxh)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm y tế (1.5%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhyt)}đ</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Bảo hiểm thất nghiệp (1%)</span><span className="font-bold text-slate-200">-{formatCurrency(results.bhtn)}đ</span></div>
                <div className="flex justify-between items-center pt-2"><span className="text-slate-300 font-bold">Tổng bảo hiểm trừ vào lương</span><span className="font-bold text-rose-400">-{formatCurrency(results.totalIns)}đ</span></div>
              </div>
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
                <span className="text-slate-300 font-bold">Thuế Thu Nhập Cá Nhân (TNCN)</span><span className="font-bold text-rose-400">-{formatCurrency(results.personalTax)}đ</span>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="text-sm font-bold text-blue-300 mb-1 uppercase tracking-wider">Lương Thực Nhận (Net)</div>
                <div className="text-4xl md:text-5xl font-black text-white">{formatCurrency(results.net)}đ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG MỞ RỘNG (DARK THEME) */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Quy định cập nhật mới nhất 2026</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
              <p>Mức lương cơ sở áp dụng mới nhất: <strong className="text-blue-400">2.530.000 đồng/tháng</strong> (Tăng theo nghị định Chính phủ).</p>
              <p>Mức giảm trừ gia cảnh bản thân: <strong className="text-blue-400">11.000.000 đồng/tháng</strong>.</p>
              <p>Mức giảm trừ người phụ thuộc: <strong className="text-blue-400">4.400.000 đồng/tháng/người</strong>.</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Lương Gross và Lương Net là gì?</h2>
            <div className="space-y-4 leading-relaxed text-slate-400">
              <p><strong className="text-white">Lương Gross</strong> là tổng thu nhập mỗi tháng mà doanh nghiệp trả cho người lao động, bao gồm cả lương cơ bản và các khoản trợ cấp, phụ cấp, hoa hồng... trong đó có cả các khoản đóng bảo hiểm và thuế thu nhập cá nhân.</p>
              <p><strong className="text-white">Lương Net</strong> là số tiền thực nhận mà người lao động được nhận về tài khoản sau khi công ty đã trừ hết các khoản chi phí bảo hiểm (BHXH, BHYT, BHTN) và thuế TNCN (nếu có).</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Câu hỏi thường gặp (Q&A)</h2>
            <div className="space-y-4">
              <details className="group bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden cursor-pointer open:bg-slate-800/80 transition-colors">
                <summary className="font-bold text-white p-5 flex justify-between items-center">
                  Nhận lương Net hay Gross có lợi hơn?
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 pt-0 text-slate-400 border-t border-slate-700/50 mt-2">
                  Về mặt tài chính, tổng chi phí doanh nghiệp bỏ ra và số tiền bạn nhận được là như nhau nếu công ty minh bạch. Tuy nhiên, đàm phán lương Gross sẽ giúp bạn chủ động kiểm soát được mức đóng bảo hiểm thực tế của mình, bảo vệ quyền lợi về hưu trí, thai sản tốt hơn.
                </div>
              </details>
              <details className="group bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden cursor-pointer open:bg-slate-800/80 transition-colors">
                <summary className="font-bold text-white p-5 flex justify-between items-center">
                  Tỷ lệ đóng bảo hiểm bắt buộc năm 2026 là bao nhiêu?
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 pt-0 text-slate-400 border-t border-slate-700/50 mt-2">
                  Người lao động trích đóng 10.5% vào quỹ bảo hiểm. Cụ thể: Quỹ Hưu trí tử tuất (BHXH): 8%; Quỹ Bảo hiểm y tế (BHYT): 1.5%; Quỹ Bảo hiểm thất nghiệp (BHTN): 1%.
                </div>
              </details>
            </div>
          </div>

          {/* KHỐI BẢN ĐỒ VÀ LIÊN HỆ */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Liên hệ Tư vấn & Bản đồ định vị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-400">Đội ngũ chuyên gia của "Số Chuẩn" luôn sẵn sàng hỗ trợ bạn xử lý các thuật toán tài chính doanh nghiệp và cá nhân một cách chính xác nhất.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3 items-center">📍 <span>Trụ sở chính: Quận Đống Đa, Hà Nội, Việt Nam</span></li>
                  <li className="flex gap-3 items-center">📞 <span>Hotline: 1900.xxxx</span></li>
                  <li className="flex gap-3 items-center">✉️ <span>Email: contact@sochuan.vn</span></li>
                </ul>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-4 transition-colors w-full md:w-auto">
                  Gửi yêu cầu hỗ trợ
                </button>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.095593888365!2d105.8239019!3d21.0288602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab748a044321%3A0x6b3017a61d6706e!2zxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ định vị Số Chuẩn">
                </iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}