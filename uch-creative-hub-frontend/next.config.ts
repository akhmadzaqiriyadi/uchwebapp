import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/public/**',
      },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8000',
      //   pathname: '/uploads/**',
      // },
      {
        protocol: 'https',
        hostname: 'kreanovasi.uty.ac.id',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kreanovasi.uty.ac.id',
        port: '',
        pathname: '/images/**',
      }
    ],
  },
};

export default nextConfig;
