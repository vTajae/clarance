import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // SF-86 PDF is ~17MB — raise the proxy body limit for /api/pdf routes
  experimental: {
    proxyClientMaxBodySize: '20mb',
  },
};

export default nextConfig;
