"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CarPriceCalculator() {
  const [carPriceInput, setCarPriceInput] = useState<string>("");
  const [region, setRegion] = useState<string>("hanoi");
  const [seats, setSeats] = useState<string>("under6");
  
  // State cho Form Lead Gen
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [result, setResult] = useState<{
    basePrice: number;
    registrationFee: number;
    plateFee: number;
    roadFee: number;
    insuranceFee: number;
    inspectionFee: number;
    totalFees: number;
    rollingPrice: number;
  } | null>(null);

  useEffect(() => {
    const savedPrice = localStorage.getItem('car_price');
    const savedRegion = localStorage.getItem('car_region');
    const savedSeats = localStorage.getItem('car_seats');
    if (savedPrice) setCarPriceInput(savedPrice);
    if (savedRegion) setRegion(savedRegion);
    if (savedSeats) setSeats(savedSeats);
  }, []);

  const handleNumberFormat = (value: string, setter: (val: string) => void, storageKey: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(formattedValue);
    localStorage.setItem(storageKey, formattedValue);
  };

  const handleCalculate = () => {
    const basePrice = parseFloat(carPriceInput.replace(/,/g, ""));
    if (isNaN(basePrice) || basePrice <= 0) return;

    localStorage.setItem('car_price', carPriceInput);
    localStorage.setItem('car_region', region);
    localStorage.setItem('car_seats', seats);

    const registrationRate = region === "hanoi" ? 0.12 : 0.10;
    const registrationFee = basePrice * registrationRate;
    let plateFee = 1000000;
    if (region === "hanoi" || region === "hcm") plateFee = 20000000;

    const roadFee = 1560000;
    const insuranceFee = seats === "under6" ? 480700 : 873400;
    const inspectionFee = 340000;

    const totalFees = registrationFee + plateFee + roadFee + insuranceFee + inspectionFee;
    const rollingPrice = basePrice + totalFees;

    setResult({ basePrice, registrationFee, plateFee, roadFee, insuranceFee, inspectionFee, totalFees, rollingPrice });
    setIsSubmitted(false); // Reset form trạng thái khi tính lại
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const chartData = result ? [
    { name: 'Giá niêm yết xe', value: result.basePrice, color: '#fb7185' },
    { name: 'Lệ phí trước bạ', value: result.registrationFee, color: '#e11d48' },
    { name: 'Phí cấp biển số', value: result.plateFee, color: '#be123c' },
    { name: 'Phí bảo trì & Đăng kiểm', value: result.roadFee + result.insuranceFee + result.inspectionFee, color: '#881337' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="mb-8 cursor-pointer text-rose-600 hover:underline font-bold inline-flex items-center print:hidden">
          &larr; Quay lại trang chủ
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden mb-12 print:shadow-none print:border-none print:mb-0">
          <div className="p-8 md:p-12 border-b border-slate-100 bg-rose-600 print:bg-white print:border-b-2 print:border-black">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight print:text-black">Bảng Dự Toán Giá Lăn Bánh Ô Tô</h1>
            <p className="text-rose-100 font-medium print:text-slate-600">Cập nhật chi phí theo quy định pháp luật mới nhất của từng địa phương</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 print:p-0 print:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Giá niêm yết của xe (VNĐ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1,020,000,000"
                  className="w-full text-2xl font-black px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  value={carPriceInput}
                  onChange={(e) => handleNumberFormat(e.target.value, setCarPriceInput, 'car_price')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Khu vực đăng ký</label>
                <select 
                  className="w-full text-lg font-bold text-slate-700 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer transition-all"
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    localStorage.setItem('car_region', e.target.value);
                  }}
                >
                  <option value="hanoi">Hà Nội & Các tỉnh áp thuế 12%</option>
                  <option value="hcm">TP. Hồ Chí Minh (Thuế 10%)</option>
                  <option value="other">Tỉnh/Thành phố khác (Thuế 10%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Loại xe</label>
                <select 
                  className="w-full text-lg font-bold text-slate-700 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer transition-all"
                  value={seats}
                  onChange={(e) => {
                    setSeats(e.target.value);
                    localStorage.setItem('car_seats', e.target.value);
                  }}
                >
                  <option value="under6">Xe dưới 6 chỗ ngồi</option>
                  <option value="over6">Xe từ 6 - 11 chỗ ngồi</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_4px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.3)] hover:-translate-y-0.5 text-xl mt-4 print:hidden"
            >
              Phân tích Giá Lăn Bánh
            </button>

            {result !== null && (
              <div className="mt-12 space-y-8 animate-fade-in print:mt-0">
                <div className="flex justify-end print:hidden">
                  <button onClick={handlePrint} className="flex items-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Xuất báo cáo PDF
                  </button>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 md:p-10 print:border-none print:bg-white print:p-0">
                  <p className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2 print:text-black">Tổng chi phí lăn bánh thực tế</p>
                  <div className="text-5xl md:text-6xl font-black text-rose-600 mb-8 tracking-tighter print:text-black">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(result.rollingPrice))} <span className="text-2xl md:text-3xl font-bold opacity-70 tracking-normal">VNĐ</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-rose-200/60 print:border-black">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-black">Giá niêm yết xe</div>
                      <div className="text-2xl font-black text-slate-800 print:text-black">{new Intl.NumberFormat('vi-VN').format(Math.round(result.basePrice))}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-black">Tổng thuế & phí Nhà nước</div>
                      <div className="text-2xl font-black text-rose-600 print:text-black">+{new Intl.NumberFormat('vi-VN').format(Math.round(result.totalFees))}</div>
                    </div>
                  </div>
                </div>

                {/* KHỐI MONETIZATION (LEAD GEN) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-700 print:hidden relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v10H2v2h2v2c0 1.1.9 2 2 2s2-.9 2-2h8c0 1.1.9 2 2 2s2-.9 2-2h2v-2h-1v-2zm-13 2c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm12 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm-1-8h-3V8h1.2c.4 0 .7.2.9.5l1.9 2.5z"/></svg>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-2">Bạn chuẩn bị mua xe?</h3>
                    <p className="text-slate-300 font-medium mb-8 max-w-xl">Hệ thống Số Chuẩn liên kết với 50+ đại lý chính hãng toàn quốc. Nhập thông tin để nhận báo giá xả kho, tặng kèm 100% trước bạ hoặc phụ kiện VIP trong hôm nay.</p>
                    
                    {!isSubmitted ? (
                      <form onSubmit={handleLeadSubmit} className="flex flex-col md:flex-row gap-4">
                        <input 
                          type="text" 
                          required
                          placeholder="Tên của bạn" 
                          className="flex-1 px-5 py-3.5 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-rose-500 font-medium placeholder-slate-500"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <input 
                          type="tel" 
                          required
                          placeholder="Số điện thoại di động" 
                          className="flex-1 px-5 py-3.5 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-rose-500 font-medium placeholder-slate-500"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                        <button type="submit" className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors shadow-lg whitespace-nowrap">
                          Nhận báo giá VIP
                        </button>
                      </form>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-5 flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <p className="text-green-100 font-bold">Yêu cầu đã được gửi! Chuyên viên đại lý sẽ liên hệ báo giá tốt nhất cho anh/chị trong ít phút.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
                    <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm print:text-left">Cơ cấu chi phí lăn bánh</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' VNĐ'} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm print:border-none print:shadow-none">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 print:bg-white print:px-0">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Khoản phí bắt buộc</h3>
                    </div>
                    <div className="p-2">
                      <table className="w-full text-sm text-left text-slate-600 print:text-black">
                        <tbody>
                          <tr className="border-b border-slate-50 print:border-b print:border-slate-300">
                            <td className="px-6 py-4 font-medium">Lệ phí trước bạ</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(Math.round(result.registrationFee))} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50 print:border-b print:border-slate-300">
                            <td className="px-6 py-4 font-medium">Phí cấp biển số</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(Math.round(result.plateFee))} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50 print:border-b print:border-slate-300">
                            <td className="px-6 py-4 font-medium">Phí bảo trì đường bộ</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(Math.round(result.roadFee))} đ</td>
                          </tr>
                          <tr className="border-b border-slate-50 print:border-b print:border-slate-300">
                            <td className="px-6 py-4 font-medium">Bảo hiểm TNDS</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(Math.round(result.insuranceFee))} đ</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-medium">Phí đăng kiểm</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(Math.round(result.inspectionFee))} đ</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* VÙNG NỘI DUNG SEO */}
        <article className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 text-slate-600 leading-relaxed print:hidden">
          <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Giá lăn bánh ô tô là gì?</h2>
          
          <p className="mb-4 text-justify font-medium">
            Khi tậu một chiếc xe mới, khoản tiền bạn thanh toán cho đại lý chỉ là giá niêm yết. Để phương tiện hợp pháp lưu thông, chủ xe bắt buộc phải hoàn thành các nghĩa vụ tài chính với cơ quan Nhà nước.
          </p>
          
          <p className="mb-4 text-justify font-medium">
            Khoản tiền thực tế cộng gộp này được định nghĩa là <strong>giá lăn bánh</strong>. Nó bao gồm lệ phí trước bạ (dao động 10% - 12% tùy địa phương), lệ phí cấp biển số, phí bảo trì đường bộ, và bảo hiểm trách nhiệm dân sự.
          </p>
        </article>
      </div>
    </div>
  );
}