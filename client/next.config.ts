import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/themes',
        destination: 'http://localhost:8080/api/themes',
      },
      {
        source: '/api/theme/:id',
        destination: 'http://localhost:8080/api/themes/:id',
      },
    ];
  },
};

export default nextConfig;
