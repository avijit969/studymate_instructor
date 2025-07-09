import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
};

export default nextConfig;
