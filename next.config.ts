import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eaassets-a.akamaihd.net",
      },
    ],
  },
};

export default nextConfig;