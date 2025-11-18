import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftp.goit.study",
      },

      {
        protocol: "https",
        hostname: "project-codecraft-backend",
      },
      {
        protocol: "https",
        hostname: "ftp.goit.study",
      },
    ],
  },
};

export default nextConfig;
