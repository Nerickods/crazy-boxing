import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security Headers for Production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // Next.js 16 Features
  reactCompiler: false,

  // Transpile framer-motion to fix Turbopack issue
  transpilePackages: ['framer-motion', 'motion-dom'],

  experimental: {
    turbopackFileSystemCacheForDev: true,  // Faster dev restarts
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Web Vitals monitoring
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;



