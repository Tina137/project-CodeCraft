import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "project-codecraft-backend",
      },
    ],
  },
};

export default nextConfig;
