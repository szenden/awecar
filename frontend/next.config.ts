import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
   
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.carcareco.app',
        pathname: '**',
      },{
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },{
        protocol: 'http',
        hostname: 'api',
        pathname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }, 
  }, 
}

 

export default nextConfig;
