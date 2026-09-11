"use client";

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. TYPES & CẤU HÌNH HẰNG SỐ
// ==========================================
type CalculationMethod = 'fixed' | 'declining';

interface PaymentSchedule {
  month: number;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}

const CHART_COLORS = ['#3b82f6', '#f43f5e']; // Xanh (Gốc) - Đỏ hồng (Lãi)

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function LoanCalculator() {
  // --- States ---
  const [amount, setAmount] = useState<string>('1000000000');
  const [rate, setRate] = useState<string>('10.5');
  const [months, setMonths] = useState<string>('12');
  const [method, setMethod] = useState<CalculationMethod>('declining');

  // --- Core Calculation Logic ---
  const { summary, schedule } = useMemo(() => {
    const principal = parseInt(amount.replace(/,/g, '')) || 0;
    const interestRate = parseFloat(rate) || 0;
    const term = parseInt(months) || 0;
    
    let schedule: PaymentSchedule[] = [];
    let totalInterest = 0;

    if (principal > 0 && interestRate > 0 && term > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPrincipal = principal / term;
      let currentPrincipal = principal;

      for (let i = 1; i <= term; i++) {
        const monthlyInterest = method === 'fixed' 
          ? (principal * monthlyRate) 
          : (currentPrincipal * monthlyRate);
          
        const totalPayment = monthlyPrincipal + monthlyInterest;
        totalInterest += monthlyInterest;
        
        schedule.push({ 
          month: i, 
          remainingPrincipal: Math.max(0, currentPrincipal), 
          principalPayment: monthlyPrincipal, 
          interestPayment: monthlyInterest, 
          totalPayment: totalPayment 
        });
        
        currentPrincipal -= monthlyPrincipal;
      }
    }
    return { 
      summary: { 
        totalPrincipal: principal, 
        totalInterest: totalInterest, 
        totalAmount: principal + totalInterest 
      }, 
      schedule 
    };
  }, [amount, rate, months, method]);

  // --- Chart Data ---
  const chartData = [
    { name: 'Tổng tiền gốc', value: summary.totalPrincipal },
    { name: 'Tổng tiền lãi', value: summary.totalInterest }
  ].filter(item => item.value > 0);

  const handlePrint = () => window.print();

  // --- Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính lãi suất vay ngân hàng 2026",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Dư nợ giảm dần là gì?",
            "acceptedAnswer": { "@type": "Answer", "text": "Là phương pháp tính tiền lãi dựa trên số tiền thực tế bạn còn nợ ngân hàng. Sau mỗi tháng trả bớt gốc, tiền lãi tháng sau sẽ thấp hơn tháng trước." }
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
            In lịch trả nợ / Lưu PDF
          </button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Công Cụ Tính Lãi Vay Ngân Hàng</h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Xuất bản chi tiết lịch trả nợ hàng tháng giúp bạn kiểm soát dòng tiền và hoạch định kế hoạch tài chính (mua nhà, mua xe) dễ dàng.</p>
        </header>

        {/* TOP SECTION: INPUTS & SUMMARY + CHART */}
        <div className="flex flex-col xl:flex-row gap-8 mb-8">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <section className="w-full xl:w-5/12 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 h-fit print:border-none print:shadow-none">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền vay (VNĐ)</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian (Tháng)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                  value={months} 
                  onChange={(e) => setMonths(e.target.value.replace(/\D/g, ''))} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-100 outline-none text-center" 
                  value={rate} 
                  onChange={(e) => { 
                    const val = e.target.value.replace(/[^0-9.]/g, ''); 
                    if (val.split('.').length <= 2) setRate(val); 
                  }} 
                />
              </div>
            </div>
            
            <div className="print:hidden">
              <label className="block text-sm font-bold text-slate-700 mb-3">Phương pháp tính</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <input type="radio" checked={method === 'declining'} onChange={() => setMethod('declining')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                  <span className="font-medium text-slate-700">Trả trên dư nợ giảm dần</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <input type="radio" checked={method === 'fixed'} onChange={() => setMethod('fixed')} className="w-5 h-5 text-blue-600 accent-blue-600" />
                  <span className="font-medium text-slate-700">Trả trên dư nợ ban đầu</span>
                </label>
              </div>
            </div>
          </section>

          {/* CỘT PHẢI: SUMMARY & CHART */}
          <section className="w-full xl:w-7/12 flex flex-col gap-6">
            
            {/* Box Tóm Tắt */}
            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 text-white print:bg-white print:text-black print:border">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-6 uppercase">Tóm Tắt Khoản Vay</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 print:border-slate-200">
                  <div className="text-sm font-medium text-slate-400 mb-2 print:text-slate-500">Tổng tiền gốc</div>
                  <div className="text-2xl md:text-3xl font-bold text-white print:text-black">{formatCurrency(summary.totalPrincipal)}đ</div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 print:border-slate-200">
                  <div className="text-sm font-medium text-slate-400 mb-2 print:text-slate-500">Tổng lãi phải trả</div>
                  <div className="text-2xl md:text-3xl font-bold text-rose-400">{formatCurrency(summary.totalInterest)}đ</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 shadow-lg print:bg-slate-100 print:shadow-none print:border-slate-300">
                  <div className="text-sm font-bold text-blue-200 mb-2 print:text-slate-700">Tổng gốc + lãi</div>
                  <div className="text-2xl md:text-3xl font-black text-white print:text-black">{formatCurrency(summary.totalAmount)}đ</div>
                </div>
              </div>
            </div>

            {/* Box Biểu đồ Tỷ trọng */}
            {summary.totalPrincipal > 0 && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm print:hidden flex-1 min-h-[250px] flex items-center justify-center">
                <div className="w-full h-full flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 h-48 md:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${formatCurrency(value)}đ`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 pl-4 border-l border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Gốc vay</div>
                        <div className="font-bold text-slate-800">{((summary.totalPrincipal / summary.totalAmount) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Lãi phải trả</div>
                        <div className="font-bold text-slate-800">{((summary.totalInterest / summary.totalAmount) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* BOTTOM SECTION: FULL WIDTH TABLE */}
        {schedule.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mb-16 print:border-none print:shadow-none">
            <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lịch Trả Nợ Chi Tiết</h3>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto print:max-h-none print:overflow-visible custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                <thead className="bg-slate-100 sticky top-0 z-10 print:bg-slate-50">
                  <tr>
                    <th className="p-5 font-bold text-slate-600 border-b">Kỳ (Tháng)</th>
                    <th className="p-5 font-bold text-slate-600 border-b">Dư nợ đầu kỳ</th>
                    <th className="p-5 font-bold text-slate-600 border-b">Gốc phải trả</th>
                    <th className="p-5 font-bold text-slate-600 border-b">Lãi phải trả</th>
                    <th className="p-5 font-black text-blue-700 border-b">Tổng tiền trả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-900 bg-slate-50/50">{row.month}</td>
                      <td className="p-5 font-medium text-slate-600">{formatCurrency(row.remainingPrincipal)}đ</td>
                      <td className="p-5 font-medium text-slate-700">{formatCurrency(row.principalPayment)}đ</td>
                      <td className="p-5 font-bold text-rose-500">{formatCurrency(row.interestPayment)}đ</td>
                      <td className="p-5 font-black text-blue-700 bg-blue-50/30">{formatCurrency(row.totalPayment)}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          4. KHU VỰC NỘI DUNG (Chuẩn EEAT & Đồng bộ Theme)
          ========================================== */}
      <article className="bg-slate-50 border-t border-slate-200 text-slate-700 py-16 print:hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          
          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Phân biệt các phương pháp tính lãi vay</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Tính theo dư nợ ban đầu</h3>
                <p className="text-slate-600 leading-relaxed">Tiền lãi mỗi tháng đều <strong>bằng nhau</strong> và được tính dựa trên toàn bộ số tiền gốc vay từ ban đầu, không quan tâm đến việc bạn đã trả bớt gốc bao nhiêu.</p>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-emerald-600 mb-3">Tính theo dư nợ giảm dần</h3>
                <p className="text-slate-600 leading-relaxed">Tiền lãi mỗi tháng được tính dựa trên <strong>số tiền thực tế bạn còn nợ</strong>. Vì mỗi tháng bạn đã trả bớt một phần gốc, nên tiền lãi các tháng sau sẽ ít dần đi.</p>
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 mb-6">2. Quy trình làm hồ sơ vay vốn ngân hàng</h2>
            <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 space-y-8 pb-4">
              
              <div className="relative pl-8">
                <div className="absolute w-8 h-8 bg-blue-600 rounded-full -left-[17px] top-0 border-4 border-slate-50 flex items-center justify-center text-sm font-bold text-white shadow-sm">1</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Chuẩn bị hồ sơ</h3>
                <p className="text-slate-600 leading-relaxed">Bao gồm: CCCD, Giấy xác nhận tình trạng hôn nhân, Hợp đồng lao động, Sao kê lương 3-6 tháng gần nhất, Hồ sơ mục đích vay (Hợp đồng cọc nhà/xe).</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute w-8 h-8 bg-slate-300 rounded-full -left-[17px] top-0 border-4 border-slate-50 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">2</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Thẩm định tài sản & Năng lực tài chính</h3>
                <p className="text-slate-600 leading-relaxed">Ngân hàng sẽ cử chuyên viên định giá tài sản thế chấp độc lập và kiểm tra lịch sử tín dụng (CIC) của bạn xem có phát sinh nợ xấu hay không.</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute w-8 h-8 bg-slate-300 rounded-full -left-[17px] top-0 border-4 border-slate-50 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">3</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Ký hợp đồng & Giải ngân</h3>
                <p className="text-slate-600 leading-relaxed">Ra phòng công chứng ký hợp đồng thế chấp. Ngân hàng tiến hành phong tỏa tài sản và giải ngân tiền cho bên bán hoặc vào thẳng tài khoản của bạn.</p>
              </div>

            </div>
          </section>

          {/* KHỐI LIÊN HỆ */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Liên hệ Tư vấn & Bản đồ định vị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-400">Đội ngũ chuyên gia của "Số Chuẩn" luôn sẵn sàng hỗ trợ bạn tính toán và lựa chọn gói vay ngân hàng tối ưu nhất.</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3 items-center">📍 <span>Trụ sở chính: Quận Đống Đa, Hà Nội, Việt Nam</span></li>
                  <li className="flex gap-3 items-center">📞 <span>Hotline: 1900.xxxx</span></li>
                  <li className="flex gap-3 items-center">✉️ <span>Email: contact@sochuan.vn</span></li>
                </ul>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-4 transition-colors w-full md:w-auto shadow-lg shadow-blue-900/50">
                  Gửi yêu cầu tư vấn vay
                </button>
              </div>
              <div className="h-64 rounded-xl overflow-hidden border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.095593888365!2d105.8239019!3d21.0288602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab748a044321%3A0x6b3017a61d6706e!2zxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ định vị">
                </iframe>
              </div>
            </div>
          </div>

        </div>
      </article>
      
      {/* Thêm chút CSS cho thanh cuộn của bảng được đẹp mắt */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </>
  );
}