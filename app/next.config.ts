import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SF-86 PDF is ~17MB — raise the proxy body limit for /api/pdf routes
  experimental: {
    proxyClientMaxBodySize: '20mb',
  },
};

export default nextConfig;
