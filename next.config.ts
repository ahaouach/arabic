import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: disable x-powered-by header to avoid revealing tech stack
  poweredByHeader: false,

  // Strict mode for catching potential issues early
  reactStrictMode: true,

  // Only allow images from trusted origins
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
