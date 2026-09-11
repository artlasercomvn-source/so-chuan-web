import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Số Chuẩn | Hệ Thống Công Cụ Tính Toán Tài Chính Chuẩn Xác",
  description: "Cung cấp công cụ tính lương Gross sang Net và lập bảng tính lãi vay mua nhà theo dư nợ giảm dần. Dữ liệu thuật toán cập nhật liên tục theo luật Thuế và Bảo hiểm hiện hành.",
  keywords: ["tính lương gross net", "tính lãi vay", "công cụ tài chính", "số chuẩn", "tính thuế tncn"],
  openGraph: {
    title: "Số Chuẩn | Hệ Thống Công Cụ Tính Toán Tài Chính",
    description: "Tối ưu hóa dòng tiền của bạn với các công cụ tính toán chuẩn xác theo luật Việt Nam.",
    type: "website",
    locale: "vi_VN",
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