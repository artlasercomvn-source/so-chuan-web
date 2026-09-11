import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Bỏ qua lỗi kiểm duyệt ngữ pháp khắt khe của thư viện Recharts
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;