import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from any domain for placeholder usage
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
