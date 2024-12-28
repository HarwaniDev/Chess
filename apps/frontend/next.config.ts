import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages : ["common"],
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com'
      }
    ]
  }
};

export default nextConfig;
