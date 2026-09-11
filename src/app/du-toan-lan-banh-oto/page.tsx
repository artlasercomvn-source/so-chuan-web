"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ (Quy định Nhà nước)
// ==========================================
const CONFIG = {
  ROAD_FEE: 1560000,
  INSPECTION_FEE: 340000,
  INSURANCE: { under6: 480700, over6: 873400 },
  PLATE_FEE: { hanoi: 20000000, hcm: 20000000, other: 1000000 },
  REGISTRATION_RATE: { hanoi: 0.12, hcm: 0.10, other: 0.10 }
};

const CHART_COLORS = ['#94a3b8', '#3b82f6', '#10b981', '#f59e0b'];

const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function CarPriceCalculator() {
  // --- Quản lý State ---
  const [carPriceInput, setCarPriceInput] = useState<string>("1020000000");
  const [region, setRegion] = useState<string>("hanoi");
  const [seats, setSeats] = useState<string>("under6");
  
  // State Form Thu thập Lead
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Bộ nhớ Thông minh (LocalStorage) ---
  useEffect(() => {
    const savedPrice = localStorage.getItem('car_price');
    const savedRegion = localStorage.getItem('car_region');
    const savedSeats = localStorage.getItem('car_seats');
    if (savedPrice) setCarPriceInput(savedPrice);
    if (savedRegion) setRegion(savedRegion);
    if (savedSeats) setSeats(savedSeats);
  }, []);

  const updateValue = (setter: (val: string) => void, storageKey: string, value: string) => {
    setter(value);
    localStorage.setItem(storageKey, value);
    setIsSubmitted(false); // Reset trạng thái form khi khách đổi số liệu
  };

  // --- Thuật toán Tính toán (Real-time) ---
  const result = useMemo(() => {
    const basePrice = parseFloat(carPriceInput.replace(/,/g, "")) || 0;
    if (basePrice <= 0) return null;

    const registrationRate = CONFIG.REGISTRATION_RATE[region as keyof typeof CONFIG.REGISTRATION_RATE] || 0.10;
    const registrationFee = basePrice * registrationRate;
    
    const plateFee = CONFIG.PLATE_FEE[region as keyof typeof CONFIG.PLATE_FEE] || 1000000;
    const roadFee = CONFIG.ROAD_FEE;
    const insuranceFee = CONFIG.INSURANCE[seats as keyof typeof CONFIG.INSURANCE] || 480700;
    const inspectionFee = CONFIG.INSPECTION_FEE;

    const totalFees = registrationFee + plateFee + roadFee + insuranceFee + inspectionFee;
    const rollingPrice = basePrice + totalFees;

    return { basePrice, registrationFee, plateFee, roadFee, insuranceFee, inspectionFee, totalFees, rollingPrice };
  }, [carPriceInput, region, seats]);

  // --- Chart Data ---
  const chartData = result ? [
    { name: 'Giá niêm yết xe', value: result.basePrice, color: CHART_COLORS[0] },
    { name: 'Lệ phí trước bạ', value: result.registrationFee, color: CHART_COLORS[1] },
    { name: 'Phí cấp biển số', value: result.plateFee, color: CHART_COLORS[2] },
    { name: 'Các phí khác (Đường bộ, BH, Đăng kiểm)', value: result.roadFee + result.insuranceFee + result.inspectionFee, color: CHART_COLORS[3] },
  ] : [];

  const handlePrint = () => window.print();

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Tại đây anh có thể tích hợp API bắn thông tin khách về Telegram hoặc Google Sheets của Số Chuẩn
  };

  // --- Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính Giá Lăn Bánh Ô Tô mới nhất 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Giá lăn bánh ô tô là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Là tổng số tiền thực tế bạn phải trả để chiếc xe được phép lưu thông hợp pháp trên đường, bao gồm giá niêm yết cộng với các loại thuế phí của Nhà nước." }
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
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Dự Toán Giá Lăn Bánh Ô Tô</h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Cập nhật chính xác biểu phí và tỷ lệ trước bạ mới nhất theo quy định pháp luật của từng tỉnh thành trong năm 2026.</p>
        </header>

        {/* KHU VỰC TÍNH TOÁN */}
        <div className="flex flex-col xl:flex-row gap-8 mb-16">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <section className="w-full xl:w-5/12 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit print:border-none print:shadow-none">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Giá niêm yết của xe (VNĐ)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                  value={carPriceInput} 
                  onChange={(e) => updateValue(setCarPriceInput, 'car_price', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Khu vực đăng ký</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all"
                  value={region} 
                  onChange={(e) => updateValue(setRegion, 'car_region', e.target.value)}
                >
                  <option value="hanoi">Hà Nội & Các tỉnh áp thuế 12%</option>
                  <option value="hcm">TP. Hồ Chí Minh (Thuế 10%)</option>
                  <option value="other">Tỉnh/Thành phố khác (Thuế 10%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại xe đăng ký</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all"
                  value={seats} 
                  onChange={(e) => updateValue(setSeats, 'car_seats', e.target.value)}
                >
                  <option value="under6">Xe cá nhân dưới 6 chỗ ngồi</option>
                  <option value="over6">Xe gia đình từ 6 - 11 chỗ ngồi</option>
                </select>
              </div>

            </div>
          </section>

          {/* CỘT PHẢI: KẾT QUẢ & LEAD GEN */}
          <section className="w-full xl:w-7/12 flex flex-col gap-6">
            
            {result !== null && (
              <>
                {/* Box Tổng Chi Phí */}
                <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white print:bg-white print:text-black print:border">
                  <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Tổng chi phí lăn bánh thực tế</h3>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 shadow-lg shadow-blue-900/50 mb-6 print:bg-slate-100 print:shadow-none print:text-black">
                    <div className="text-4xl md:text-6xl font-black text-white tracking-tight print:text-black">
                      {formatCurrency(result.rollingPrice)} <span className="text-2xl font-bold opacity-70">VNĐ</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800 print:border-slate-200">
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider print:text-slate-500">Giá niêm yết xe</div>
                      <div className="text-2xl font-bold text-white print:text-black">{formatCurrency(result.basePrice)}đ</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider print:text-slate-500">Tổng thuế phí Nhà nước</div>
                      <div className="text-2xl font-bold text-blue-400">+{formatCurrency(result.totalFees)}đ</div>
                    </div>
                  </div>
                </div>

                {/* KHỐI MONETIZATION (LEAD GEN) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700 print:hidden relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-48 h-48 text-white -mt-10 -mr-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.28l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-2">Bạn chuẩn bị tậu xế hộp?</h3>
                    <p className="text-slate-300 font-medium mb-6 max-w-xl">Hệ thống Số Chuẩn liên kết với 50+ đại lý chính hãng toàn quốc. Nhập thông tin để nhận <strong>báo giá xả kho, tặng kèm 100% trước bạ</strong> hoặc phụ kiện VIP trong hôm nay.</p>
                    
                    {!isSubmitted ? (
                      <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input type="text" required placeholder="Tên của bạn" 
                          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium placeholder-slate-400"
                          value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        <input type="tel" required placeholder="Số điện thoại di động" 
                          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium placeholder-slate-400"
                          value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg whitespace-nowrap">
                          Nhận báo giá VIP
                        </button>
                      </form>
                    ) : (
                      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <p className="text-emerald-100 font-medium">Yêu cầu đã được gửi! Chuyên viên đại lý sẽ liên hệ báo giá tốt nhất cho anh/chị trong ít phút.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Biểu đồ & Bảng chi tiết */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Biểu đồ */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm print:hidden flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4 text-center">Cơ cấu chi phí lăn bánh</h3>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${formatCurrency(value)} đ`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bảng liệt kê */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm print:border-none print:shadow-none">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 print:bg-white">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Khoản phí bắt buộc</h3>
                    </div>
                    <div className="p-1">
                      <table className="w-full text-sm text-left text-slate-600 print:text-black">
                        <tbody>
                          <tr className="border-b border-slate-50">
                            <td className="px-4 py-3 font-medium">Lệ phí trước bạ</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(result.registrationFee)} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50">
                            <td className="px-4 py-3 font-medium">Phí cấp biển số</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(result.plateFee)} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50">
                            <td className="px-4 py-3 font-medium">Phí bảo trì đường bộ</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(result.roadFee)} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50">
                            <td className="px-4 py-3 font-medium">Bảo hiểm TNDS</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(result.insuranceFee)} đ</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Phí đăng kiểm</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(result.inspectionFee)} đ</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

        </div>
      </main>

      {/* ==========================================
          4. KHU VỰC NỘI DUNG SEO (Tối ưu EEAT)
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Giá lăn bánh ô tô là gì?</h2>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
              <p className="text-slate-600 leading-relaxed">Khi tậu một chiếc xe mới, khoản tiền bạn thanh toán cho đại lý chỉ là <strong>giá niêm yết</strong> (hoặc giá đã trừ khuyến mãi). Để phương tiện được cấp phép lưu thông hợp pháp trên đường, chủ xe bắt buộc phải hoàn thành một loạt các nghĩa vụ tài chính với cơ quan Nhà nước.</p>
              <p className="text-slate-600 leading-relaxed">Tổng cộng khoản tiền thực tế này được gọi là <strong>giá lăn bánh</strong>. Chênh lệch giữa giá niêm yết và giá lăn bánh có thể từ vài chục đến hàng trăm triệu đồng tùy thuộc vào dòng xe và hộ khẩu đăng ký.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Chi tiết 5 loại phí bắt buộc khi mua xe mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 font-black">1</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Lệ phí trước bạ</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Chiếm tỷ trọng lớn nhất (thường là 10% - 12% giá trị xe). Ví dụ: Hà Nội, Quảng Ninh, Hải Phòng áp dụng mức 12%, trong khi TP.HCM là 10%.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 font-black">2</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Phí cấp biển số</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Hà Nội và TP.HCM thu mức cao nhất là 20.000.000 VNĐ. Các tỉnh lẻ hoặc thành phố trực thuộc trung ương khác chỉ thu 1.000.000 VNĐ.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-xl mb-4 font-black">3</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Phí bảo trì đường bộ</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Thu cố định 1.560.000 VNĐ/năm đối với xe chở người dưới 10 chỗ đăng ký tên cá nhân.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-xl mb-4 font-black">4</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Bảo hiểm & Đăng kiểm</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Bảo hiểm Trách nhiệm dân sự là bắt buộc (khoảng 480k - 873k). Phí kiểm định kỹ thuật xe là 340.000 VNĐ.</p>
              </div>

            </div>
          </section>

        </div>
      </article>
    </>
  );
}