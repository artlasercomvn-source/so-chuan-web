import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Số Chuẩn | Hệ Thống Công Cụ Tính Toán Tài Chính Chuẩn Xác",
    template: "%s | Số Chuẩn" // Tự động nối " | Số Chuẩn" vào đuôi tiêu đề của các công cụ con
  },
  description: "Cung cấp công cụ tính lương Gross sang Net và lập bảng tính lãi vay mua nhà theo dư nợ giảm dần. Dữ liệu thuật toán cập nhật liên tục theo luật Thuế và Bảo hiểm hiện hành.",
  keywords: ["tính lương gross net", "tính lãi vay", "công cụ tài chính", "số chuẩn", "tính thuế tncn", "giá lăn bánh ô tô", "tính bhxh 1 lần", "lãi tiết kiệm"],
  openGraph: {
    title: "Số Chuẩn | Hệ Thống Công Cụ Tính Toán Tài Chính",
    description: "Tối ưu hóa dòng tiền của bạn với các công cụ tính toán chuẩn xác theo luật Việt Nam.",
    url: "https://sochuan.vn",
    siteName: "Số Chuẩn",
    locale: "vi_VN",
    type: "website",
  },
  // Bổ sung luồng điều hướng chuẩn xác cho Googlebot và hệ thống trích xuất AI Overview
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1, // Cho phép Google lấy đoạn mã hiển thị dài nhất có thể lên Top 0
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}