import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages : ["common", "@chessmate/db"],
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com'
      }
    ]
  }
};

export default nextConfig;
