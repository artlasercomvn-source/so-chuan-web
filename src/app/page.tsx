import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      {/* HIỆU ỨNG ÁNH SÁNG NỀN */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]"></div>

      {/* THANH ĐIỀU HƯỚNG NỔI */}
      <header className="fixed top-6 inset-x-0 mx-auto max-w-7xl px-4 z-50 animate-fade-in-down">
        <div className="bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-3xl px-6 py-4 flex justify-between items-center transition-all hover:bg-white">
          <div className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Số Chuẩn.
          </div>
          <nav className="hidden md:flex space-x-10 text-sm font-bold text-slate-600">
            <a href="#danh-sach-cong-cu" className="hover:text-blue-600 transition-colors">Công Cụ Tính</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tra Cứu Luật</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tin Tức Tài Chính</a>
          </nav>
          <div className="hidden md:block">
            {/* Đã chuyển button thành thẻ a có href trỏ xuống ID danh-sach-cong-cu */}
            <a href="#danh-sach-cong-cu" className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.3)] hover:-translate-y-0.5">
              Khám phá ngay
            </a>
          </div>
        </div>
      </header>

      {/* KHU VỰC HERO ĐẲNG CẤP */}
      <section className="pt-48 pb-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/50 text-blue-700 px-5 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span>Nền tảng Fintech chuẩn xác 100%</span>
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-tighter mb-8 leading-[1.05] text-slate-900">
            Công Cụ Tính Toán. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Chuyên Gia Tài Chính.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
            Hệ sinh thái tiện ích tài chính dẫn đầu thị trường. Xử lý thuật toán phức tạp ngay trên trình duyệt, bảo mật tuyệt đối. Cập nhật thời gian thực theo luật Thuế và Bảo hiểm Việt Nam.
          </p>
        </div>
      </section>

      {/* MA TRẬN CÔNG CỤ (Thêm ID danh-sach-cong-cu và scroll-mt-32 để không bị menu che khuất) */}
      <main id="danh-sach-cong-cu" className="max-w-7xl mx-auto px-4 pb-20 relative z-10 scroll-mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Link href="/tinh-luong-gross-net" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-blue-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-blue-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-blue-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">Tính Lương Gross sang Net</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Quy đổi lương thực nhận, tự động phân rã tỷ trọng thuế TNCN và các khoản bảo hiểm bắt buộc theo biểu đồ trực quan.</p>
            </div>
          </Link>

          <Link href="/tinh-lai-vay" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-green-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-green-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white text-green-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-green-600 transition-colors tracking-tight">Tính Lãi Vay Ngân Hàng</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Thiết lập lộ trình trả nợ chi tiết theo dư nợ giảm dần, đối chiếu dòng tiền gốc lãi thông qua hệ thống đồ thị tương tác.</p>
            </div>
          </Link>

          <Link href="/tinh-bhxh-1-lan" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-purple-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-purple-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-purple-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white text-purple-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-purple-600 transition-colors tracking-tight">Tính Tiền BHXH 1 Lần</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Bóc tách hệ số nhân theo từng giai đoạn đóng góp. Dự toán chính xác số tiền bảo hiểm nhận lại qua báo cáo chuyên sâu.</p>
            </div>
          </Link>

          <Link href="/tinh-lai-tiet-kiem" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-amber-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-amber-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-amber-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white text-amber-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-amber-500 transition-colors tracking-tight">Tính Lãi Gửi Tiết Kiệm</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Lập bảng theo dõi dòng tiền gửi góp định kỳ. Hiểu rõ sự phình to của tài sản nhờ sức mạnh lãi nhập gốc qua biểu đồ.</p>
            </div>
          </Link>

          <Link href="/du-toan-lan-banh-oto" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-rose-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-rose-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-rose-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white text-rose-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight">Tính Giá Lăn Bánh Ô Tô</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Bóc trần chi phí thực tế. Tự động tính lệ phí trước bạ, phí biển số và bảo hiểm dựa trên biểu phí pháp định từng địa phương.</p>
            </div>
          </Link>

          <Link href="/quyet-toan-thue-tncn" className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-cyan-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 block">
            <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 text-cyan-900 rotate-12 scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-cyan-50/80 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white text-cyan-600 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">Tính Quyết Toán Thuế TNCN</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Tối ưu cho cá nhân đa nguồn thu nhập. Đối soát số thuế đã nộp và số thực tế phải nộp theo biểu thuế lũy tiến từng phần.</p>
            </div>
          </Link>

        </div>
      </main>

      {/* TÍN HIỆU UY TÍN */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <span className="text-2xl">⚡️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tốc Độ Vượt Trội</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Kiến trúc điện toán biên (Edge Computing) xử lý thuật toán ngay trên thiết bị người dùng. Phản hồi tức thời không độ trễ.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bảo Mật 100%</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Trạng thái dữ liệu tự động bị vô hiệu hóa khi đóng trình duyệt. Quyền riêng tư đối với con số tài chính của bạn là tuyệt đối.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <span className="text-2xl">📑</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Xuất Báo Cáo In</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Tự động loại bỏ thành phần thừa, kết xuất đồ thị và lưới dữ liệu ra văn bản PDF chuyên nghiệp chuẩn báo cáo ngân hàng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BÀI VIẾT NỀN TẢNG EEAT & SEO */}
      <section className="bg-slate-50 border-t border-slate-200/60 py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Số Chuẩn - Trợ lý tài chính cá nhân toàn diện</h2>
            <p className="text-slate-500 font-medium">Giải pháp tính toán minh bạch, định hình quyết định đầu tư an toàn.</p>
          </div>
          
          <article className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed text-justify">
            <p className="mb-5">
              Trong kỷ nguyên số, việc quản trị dòng tiền cá nhân đòi hỏi độ chính xác tuyệt đối. Hệ sinh thái <strong>Số Chuẩn</strong> được phát triển nhằm cung cấp bộ công cụ tính toán tài chính chuyên sâu, loại bỏ hoàn toàn sai số của các phương pháp tính nhẩm thủ công.
            </p>
            <p className="mb-5">
              Từ việc lập bảng tính lãi vay mua nhà hàng tháng theo dư nợ giảm dần, cho đến ước tính số tiền hoàn thuế thu nhập cá nhân dịp đầu năm; mọi thuật toán đều được lập trình bám sát các thông tư, nghị định mới nhất của cơ quan chức năng.
            </p>
            <p className="mb-5">
              Giao diện được thiết kế tối giản, tập trung tối đa vào biểu đồ trực quan và trải nghiệm người dùng. Chúng tôi cam kết mang lại một nền tảng tra cứu minh bạch, tốc độ và hoàn toàn miễn phí cho cộng đồng.
            </p>
          </article>
        </div>
      </section>

      {/* FOOTER ENTERPRISE */}
      <footer className="bg-[#0f172a] text-slate-400 pt-20 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Cột 1: Thương hiệu */}
            <div className="md:col-span-1">
              <div className="text-3xl font-black text-white mb-6 tracking-tighter">Số Chuẩn.</div>
              <p className="text-sm leading-relaxed mb-6">
                Nền tảng tiện ích tài chính và quản trị dòng tiền cá nhân dẫn đầu thị trường. Kiến trúc bảo mật, thuật toán chính xác tuyệt đối.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            {/* Cột 2: Hệ sinh thái công cụ */}
            <div className="md:col-span-1 md:col-start-3">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Công Cụ Nổi Bật</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/tinh-luong-gross-net" className="hover:text-white transition-colors">Tính Lương Gross sang Net</Link></li>
                <li><Link href="/tinh-lai-vay" className="hover:text-white transition-colors">Tính Lãi Vay Theo Dư Nợ</Link></li>
                <li><Link href="/tinh-lai-tiet-kiem" className="hover:text-white transition-colors">Tính Lãi Tiết Kiệm</Link></li>
                <li><Link href="/du-toan-lan-banh-oto" className="hover:text-white transition-colors">Tính Giá Lăn Bánh Ô Tô</Link></li>
              </ul>
            </div>

            {/* Cột 3: Pháp lý & Hỗ trợ */}
            <div className="md:col-span-1">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Pháp Lý & Hỗ Trợ</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật dữ liệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ chuyên gia</a></li>
              </ul>
            </div>
            
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-medium opacity-80 mb-4 md:mb-0">
              © {new Date().getFullYear()} Số Chuẩn. All rights reserved.
            </p>
            <div className="text-sm font-medium opacity-80">
              Phát triển với cấu trúc mã nguồn Next.js tiêu chuẩn quốc tế.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}