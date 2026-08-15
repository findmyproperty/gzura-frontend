/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.theybdc.com',
        pathname: '/uploads/events/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ]
   },
};

module.exports = nextConfig;
