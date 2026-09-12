"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CONFIG = {
  ROAD_FEE: 1560000,
  INSPECTION_FEE: 340000,
  INSURANCE: { under6: 480700, over6: 873400 },
  PLATE_FEE: { hanoi: 20000000, hcm: 20000000, other: 1000000 },
  REGISTRATION_RATE: { hanoi: 0.12, hcm: 0.10, other: 0.10 }
};

const CHART_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

export default function CarPriceCalculator() {
  const [carPriceInput, setCarPriceInput] = useState<string>("1020000000");
  const [region, setRegion] = useState<string>("hanoi");
  const [seats, setSeats] = useState<string>("under6");
  
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    setIsSubmitted(false);
  };

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

  const chartData = result ? [
    { name: 'Giá xe niêm yết', value: result.basePrice, color: CHART_COLORS[0] },
    { name: 'Lệ phí trước bạ', value: result.registrationFee, color: CHART_COLORS[1] },
    { name: 'Phí cấp biển số', value: result.plateFee, color: CHART_COLORS[2] },
    { name: 'Phí bảo trì, Đăng kiểm, BH', value: result.roadFee + result.insuranceFee + result.inspectionFee, color: CHART_COLORS[3] },
  ] : [];

  const handlePrint = () => window.print();

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ Dự Toán Giá Lăn Bánh Ô Tô 2026",
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Dự Toán Giá Lăn Bánh Ô Tô</h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">Thuật toán cập nhật chính xác biểu phí và tỷ lệ trước bạ mới nhất theo quy định pháp luật của từng tỉnh thành trong năm 2026.</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá niêm yết của xe (VNĐ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" 
                    value={carPriceInput} 
                    onChange={(e) => updateValue(setCarPriceInput, 'car_price', e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Khu vực đăng ký hộ khẩu</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all appearance-none"
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
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer transition-all appearance-none"
                    value={seats} 
                    onChange={(e) => updateValue(setSeats, 'car_seats', e.target.value)}
                  >
                    <option value="under6">Xe cá nhân dưới 6 chỗ ngồi</option>
                    <option value="over6">Xe gia đình từ 6 - 11 chỗ ngồi</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              {result !== null && (
                <>
                  <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
                    
                    <h3 className="text-xs md:text-sm font-bold tracking-widest text-slate-400 mb-4 md:mb-6 uppercase relative z-10">Tổng chi phí lăn bánh</h3>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 md:p-8 shadow-2xl mb-6 md:mb-8 relative z-10 print:bg-slate-100 print:shadow-none print:text-black">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight break-words print:text-black">
                        {formatCurrency(result.rollingPrice)} <span className="text-xl md:text-2xl font-bold opacity-70">VNĐ</span>
                      </div>
                    </div>

                    {/* Sử dụng grid-cols-1 trên mobile, grid-cols-2 trên tablet trở lên để tránh đè chữ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-slate-800 relative z-10 print:border-slate-200">
                      <div>
                        <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Giá niêm yết</div>
                        <div className="text-xl sm:text-2xl font-bold text-white break-words">{formatCurrency(result.basePrice)}đ</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-400 mb-1 md:mb-2 uppercase tracking-wider">Tổng thuế phí</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-400 break-words">+{formatCurrency(result.totalFees)}đ</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col justify-center print:hidden">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-4 text-center">Cơ cấu chi phí</h3>
                      <div className="h-48 md:h-52 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} 
                              paddingAngle={3} dataKey="value" stroke="none"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => `${formatCurrency(value)} đ`} 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 space-y-2">
                        {chartData.map((item, idx) => (
                          <div key={idx} className="flex items-center text-xs text-slate-600">
                            <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                            <span className="flex-1 truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm flex flex-col print:border-none print:shadow-none">
                      <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Chi tiết khoản phí</h3>
                      </div>
                      <div className="p-2 flex-1 flex flex-col justify-center">
                        <table className="w-full text-xs md:text-sm text-left text-slate-600">
                          <tbody>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3 font-medium">Lệ phí trước bạ</td>
                              <td className="px-3 md:px-4 py-3 text-right font-bold text-slate-900 break-words">{formatCurrency(result.registrationFee)} đ</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3 font-medium">Phí cấp biển số</td>
                              <td className="px-3 md:px-4 py-3 text-right font-bold text-slate-900 break-words">{formatCurrency(result.plateFee)} đ</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3 font-medium">Phí bảo trì đường bộ</td>
                              <td className="px-3 md:px-4 py-3 text-right font-bold text-slate-900 break-words">{formatCurrency(result.roadFee)} đ</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3 font-medium">Bảo hiểm TNDS</td>
                              <td className="px-3 md:px-4 py-3 text-right font-bold text-slate-900 break-words">{formatCurrency(result.insuranceFee)} đ</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-4 py-3 font-medium">Phí đăng kiểm</td>
                              <td className="px-3 md:px-4 py-3 text-right font-bold text-slate-900 break-words">{formatCurrency(result.inspectionFee)} đ</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-5 md:p-6 shadow-lg border border-emerald-400 print:hidden relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="relative z-10 flex-1 text-center md:text-left">
                      <h3 className="text-lg md:text-xl font-black text-white mb-1">So sánh giá lăn bánh?</h3>
                      <p className="text-emerald-50 text-xs md:text-sm">Hệ thống liên kết 50+ Đại lý. Nhận báo giá rẻ nhất, ưu đãi 100% trước bạ ngay hôm nay.</p>
                    </div>
                    {!isSubmitted ? (
                      <form onSubmit={handleLeadSubmit} className="relative z-10 flex flex-col sm:flex-row w-full md:w-auto gap-2">
                        <input type="tel" required placeholder="Nhập SĐT báo giá..." className="w-full sm:w-48 px-4 py-3 bg-white/20 border border-white/30 text-white rounded-xl focus:outline-none focus:bg-white focus:text-slate-900 placeholder-emerald-100 font-medium transition-all text-sm" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        <button type="submit" className="w-full sm:w-auto px-5 py-3 bg-white text-teal-700 hover:bg-emerald-50 font-black rounded-xl transition-colors shadow-md text-sm whitespace-nowrap">Gửi</button>
                      </form>
                    ) : (
                      <div className="relative z-10 bg-white/20 rounded-xl px-4 py-3 text-white font-bold text-sm text-center">✅ Đã gửi yêu cầu!</div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <article className="bg-white border-t border-slate-200 text-slate-700 py-12 md:py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Giá lăn bánh ô tô là gì?</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 text-center">
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">Giá lăn bánh là <strong>tổng số tiền thực tế</strong> mà chủ xe phải chi trả để chiếc ô tô có đầy đủ giấy tờ hợp pháp lưu thông trên đường.</p>
              <div className="inline-block bg-white border border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-sm font-mono text-blue-600 font-bold text-sm md:text-lg break-words max-w-full">
                Lăn bánh = Giá niêm yết + Thuế, Phí
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Chi tiết 5 khoản phí bắt buộc (2026)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-7xl md:text-9xl font-black text-slate-50 -mt-4 md:-mt-8 -mr-2 md:-mr-4 select-none">1</div>
                <h3 className="font-bold text-blue-600 text-lg md:text-xl mb-2 md:mb-3 relative z-10">Lệ phí trước bạ</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed relative z-10">Hà Nội, Hải Phòng, Quảng Ninh áp dụng mức <strong>12%</strong>. TP. Hồ Chí Minh và các tỉnh thành còn lại áp dụng mức <strong>10%</strong> trên giá niêm yết.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-7xl md:text-9xl font-black text-slate-50 -mt-4 md:-mt-8 -mr-2 md:-mr-4 select-none">2</div>
                <h3 className="font-bold text-blue-600 text-lg md:text-xl mb-2 md:mb-3 relative z-10">Phí cấp biển số</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed relative z-10">Hà Nội và TP.HCM thu phí cao nhất: <strong>20.000.000 VNĐ</strong>. Các tỉnh lẻ dao động từ 200.000 - 1.000.000 VNĐ.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-7xl md:text-9xl font-black text-slate-50 -mt-4 md:-mt-8 -mr-2 md:-mr-4 select-none">3</div>
                <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-2 md:mb-3 relative z-10">Phí bảo trì đường bộ</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed relative z-10">Đóng cố định hàng năm. Đối với ô tô chở người đăng ký tên cá nhân, mức phí là <strong>1.560.000 VNĐ/năm</strong>.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-7xl md:text-9xl font-black text-slate-50 -mt-4 md:-mt-8 -mr-2 md:-mr-4 select-none">4</div>
                <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-2 md:mb-3 relative z-10">Bảo hiểm & Đăng kiểm</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed relative z-10">Bảo hiểm TNDS (bắt buộc) từ <strong>480.700 VNĐ</strong>. Phí kiểm định chất lượng là <strong>340.000 VNĐ</strong>.</p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6">Câu hỏi thường gặp</h2>
            <div className="space-y-3 md:space-y-4">
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Mua xe cũ có phải chịu lệ phí trước bạ 10-12% không?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Không. Khi mua lại ô tô cũ, lệ phí trước bạ áp dụng đồng nhất toàn quốc là <strong>2%</strong> tính trên giá trị khấu hao còn lại.
                </div>
              </details>
              <details className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer">
                <summary className="font-bold text-slate-800 p-4 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Có bắt buộc mua bảo hiểm vật chất (thân vỏ) không?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 md:p-6 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 mt-2">
                  Bảo hiểm vật chất là <strong>tự nguyện</strong>. Tuy nhiên, nếu mua xe trả góp, ngân hàng sẽ bắt buộc bạn mua bảo hiểm này trong thời gian thế chấp.
                </div>
              </details>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}