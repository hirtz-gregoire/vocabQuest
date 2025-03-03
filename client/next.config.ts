import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/themes',
        destination: `${apiBaseUrl}/themes`,
      },
      {
        source: '/api/theme/:id',
        destination: `${apiBaseUrl}/themes/:id`,
      },
    ];
  },
};

export default nextConfig;
