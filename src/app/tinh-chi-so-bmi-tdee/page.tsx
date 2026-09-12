"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ==========================================
// 1. CẤU HÌNH & HẰNG SỐ 
// ==========================================
const ACTIVITY_LEVELS = [
  { id: 1.2, name: 'Ít vận động', desc: 'Chỉ làm việc văn phòng, không tập thể dục' },
  { id: 1.375, name: 'Vận động nhẹ', desc: 'Tập thể dục nhẹ nhàng 1-3 ngày/tuần' },
  { id: 1.55, name: 'Vận động vừa', desc: 'Tập thể dục cường độ vừa 3-5 ngày/tuần' },
  { id: 1.725, name: 'Vận động nhiều', desc: 'Tập cường độ cao 6-7 ngày/tuần' },
  { id: 1.9, name: 'Vận động cường độ rất cao', desc: 'Vận động viên, công việc chân tay nặng' }
];

const MACRO_COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Protein, Carb, Fat
const formatCurrency = (val: number) => Math.round(val).toLocaleString('vi-VN');

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function HealthCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>("25");
  const [weight, setWeight] = useState<string>("65");
  const [height, setHeight] = useState<string>("170");
  const [activity, setActivity] = useState<number>(1.2);

  // --- Smart Memory (LocalStorage) ---
  useEffect(() => {
    const savedGender = localStorage.getItem('hlth_gender');
    const savedAge = localStorage.getItem('hlth_age');
    const savedWeight = localStorage.getItem('hlth_weight');
    const savedHeight = localStorage.getItem('hlth_height');
    const savedActivity = localStorage.getItem('hlth_activity');
    
    if (savedGender) setGender(savedGender as 'male' | 'female');
    if (savedAge) setAge(savedAge);
    if (savedWeight) setWeight(savedWeight);
    if (savedHeight) setHeight(savedHeight);
    if (savedActivity) setActivity(Number(savedActivity));
  }, []);

  const updateState = (setter: any, key: string, value: any) => {
    setter(value);
    localStorage.setItem(key, value.toString());
  };

  // --- Core Calculation Logic ---
  const result = useMemo(() => {
    const a = parseInt(age) || 0;
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0; // cm

    if (a <= 0 || w <= 0 || h <= 0) return null;

    // Tính BMI
    const heightInMeter = h / 100;
    const bmi = w / (heightInMeter * heightInMeter);
    
    let bmiStatus = '';
    let bmiColor = '';
    if (bmi < 18.5) { bmiStatus = 'Thiếu cân'; bmiColor = 'text-blue-500'; }
    else if (bmi >= 18.5 && bmi < 24.9) { bmiStatus = 'Bình thường'; bmiColor = 'text-emerald-500'; }
    else if (bmi >= 25 && bmi < 29.9) { bmiStatus = 'Thừa cân'; bmiColor = 'text-amber-500'; }
    else { bmiStatus = 'Béo phì'; bmiColor = 'text-rose-600'; }

    // Tính BMR theo công thức Mifflin-St Jeor
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    // Tính TDEE
    const tdee = Math.round(bmr * activity);

    // Tính Macro cho mức giữ cân (Maintenance): 30% Protein, 40% Carb, 30% Fat
    const proteinCal = tdee * 0.3;
    const carbCal = tdee * 0.4;
    const fatCal = tdee * 0.3;

    const macros = [
      { name: 'Đạm (Protein)', value: Math.round(proteinCal / 4), cal: proteinCal, color: MACRO_COLORS[0] },
      { name: 'Tinh bột (Carb)', value: Math.round(carbCal / 4), cal: carbCal, color: MACRO_COLORS[1] },
      { name: 'Chất béo (Fat)', value: Math.round(fatCal / 9), cal: fatCal, color: MACRO_COLORS[2] }
    ];

    return { bmi: bmi.toFixed(1), bmiStatus, bmiColor, bmr: Math.round(bmr), tdee, macros };
  }, [gender, age, weight, height, activity]);

  const handlePrint = () => window.print();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Công cụ tính chỉ số BMI và TDEE",
        "applicationCategory": "HealthApplication",
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
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white shadow-sm border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
              Trang chủ
            </a>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> 
              Lưu kết quả PDF
            </button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              Máy Tính Chỉ Số Cơ Thể
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
              Khám phá chỉ số BMI, tỷ lệ trao đổi chất (BMR) và lượng Calo tiêu thụ mỗi ngày (TDEE) để xây dựng lộ trình giảm cân hoặc tăng cơ khoa học.
            </p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 mb-16">
            
            <section className="w-full xl:w-[40%] bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-5 md:p-8 h-fit print:border-none print:shadow-none">
              <div className="space-y-6">
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl print:hidden">
                  <button 
                    onClick={() => updateState(setGender, 'hlth_gender', 'male')} 
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    👨 Nam giới
                  </button>
                  <button 
                    onClick={() => updateState(setGender, 'hlth_gender', 'female')} 
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${gender === 'female' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    👩 Nữ giới
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Tuổi</label>
                    <input type="number" min="1" max="120" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-inner text-center" 
                      value={age} 
                      onChange={(e) => updateState(setAge, 'hlth_age', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Chiều cao (cm)</label>
                    <input type="number" min="50" max="250" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-inner text-center" 
                      value={height} 
                      onChange={(e) => updateState(setHeight, 'hlth_height', e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Cân nặng (kg)</label>
                  <input type="number" min="10" max="300" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-800 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-inner text-center" 
                    value={weight} 
                    onChange={(e) => updateState(setWeight, 'hlth_weight', e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Mức độ vận động</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-emerald-100 outline-none cursor-pointer transition-all appearance-none"
                    value={activity} 
                    onChange={(e) => updateState(setActivity, 'hlth_activity', Number(e.target.value))}
                  >
                    {ACTIVITY_LEVELS.map(level => (
                      <option key={level.id} value={level.id}>{level.name} - {level.desc}</option>
                    ))}
                  </select>
                </div>

              </div>
            </section>

            <section className="w-full xl:w-[60%] flex flex-col gap-6">
              
              {result && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                    
                    <div className="bg-slate-900 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 print:bg-white print:text-black print:border-slate-200 print:border">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Chỉ số BMI (Body Mass)</h3>
                      <div className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white print:text-black">{result.bmi}</div>
                      <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-white/10 ${result.bmiColor}`}>{result.bmiStatus}</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] shadow-xl p-6 md:p-8 text-white relative overflow-hidden print:bg-slate-100 print:shadow-none print:text-black">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-100 print:text-slate-500">TDEE (Calo tiêu thụ / ngày)</h3>
                      <div className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white print:text-black">{formatCurrency(result.tdee)}</div>
                      <div className="text-xs font-medium text-emerald-50 print:text-slate-600">Lượng Calo cần để duy trì cân nặng hiện tại.</div>
                    </div>

                  </div>

                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-8 shadow-sm flex flex-col justify-center print:hidden">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-6 text-center">Tỷ lệ Dinh dưỡng tham khảo (Giữ cân)</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="h-48 w-full md:w-1/2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={result.macros} cx="50%" cy="50%" innerRadius={55} outerRadius={80} 
                              paddingAngle={3} dataKey="cal" stroke="none"
                            >
                              {result.macros.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => `${formatCurrency(value)} Calo`} 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                        {result.macros.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                              <span className="font-bold text-sm text-slate-700">{item.name}</span>
                            </div>
                            <span className="font-black text-slate-900 text-lg">{item.value}g</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-blue-500 uppercase mb-1">Giảm Cân an toàn</div>
                        <div className="text-xl font-black text-blue-700">{formatCurrency(result.tdee - 500)} calo/ngày</div>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-rose-500 uppercase mb-1">Tăng cơ / Bulking</div>
                        <div className="text-xl font-black text-rose-700">{formatCurrency(result.tdee + 500)} calo/ngày</div>
                      </div>
                    </div>
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
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 text-center">Hiểu Rõ Về Cơ Thể Của Bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm font-black text-blue-600">BMR</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">Chỉ số BMR là gì?</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                  BMR (Basal Metabolic Rate) là Tỷ lệ trao đổi chất cơ bản. Đây là lượng Calo tối thiểu mà cơ thể bạn cần để duy trì các chức năng sống cơ bản (thở, tuần hoàn máu, hoạt động não) khi bạn nằm nghỉ ngơi hoàn toàn. Tuyệt đối không bao giờ được ăn dưới mức BMR này nếu không muốn cơ thể bị suy nhược.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm font-black text-emerald-600">TDEE</div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3">TDEE quan trọng thế nào?</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                  TDEE (Total Daily Energy Expenditure) là tổng lượng Calo bạn đốt cháy trong một ngày (bao gồm cả BMR và các hoạt động vận động, làm việc). Đây là con số quan trọng nhất. Nếu bạn ăn bằng TDEE bạn sẽ giữ cân, ăn ít hơn TDEE sẽ giảm cân (Thâm hụt calo), và ăn nhiều hơn TDEE sẽ tăng cân.
                </p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              
              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Làm sao để giảm cân an toàn mà không mệt mỏi?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  Nguyên tắc cốt lõi của việc giảm cân là tạo ra <strong>Sự thâm hụt Calo (Caloric Deficit)</strong>. Bạn nên ăn ít hơn chỉ số TDEE khoảng 300 - 500 Calo mỗi ngày. Tuyệt đối không được nhịn ăn quá khắt khe khiến mức Calo nạp vào thấp hơn cả chỉ số BMR. Hãy kết hợp với các bài tập vận động tại nhà như Squat, Lunge, hay Plank để cơ thể săn chắc hơn.
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
                <summary className="font-bold text-slate-800 p-5 md:p-6 text-sm md:text-base flex justify-between items-center outline-none">
                  Chỉ số BMI có hoàn toàn chính xác không?
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 md:p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                  BMI là công cụ sàng lọc sơ bộ rất tốt cho người bình thường. Tuy nhiên, BMI <strong>không phân biệt được trọng lượng của cơ bắp và mỡ</strong>. Một vận động viên thể hình có lượng cơ bắp lớn sẽ có cân nặng cao, dẫn đến chỉ số BMI rơi vào ngưỡng "Thừa cân" hoặc "Béo phì", mặc dù lượng mỡ trong cơ thể họ rất thấp. Do đó, hãy kết hợp đo tỷ lệ mỡ cơ thể (Body Fat %) để có cái nhìn chính xác nhất.
                </div>
              </details>

            </div>
          </section>

        </div>
      </article>
    </>
  );
}