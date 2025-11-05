import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return []
  },
  eslint: {
    // Cho phép build thành công ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Cho phép build thành công ngay cả khi có lỗi TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
