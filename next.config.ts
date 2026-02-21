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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://xcfqbwtlimgrkgpypzmj.supabase.co",
              "media-src 'self' blob: https://xcfqbwtlimgrkgpypzmj.supabase.co",
              "connect-src 'self' https://xcfqbwtlimgrkgpypzmj.supabase.co https://openrouter.ai",
              "frame-ancestors 'none'",
            ].join('; ')
          },
        ],
      },
    ];
  },

  // Next.js 16 Features
  reactCompiler: false,

  // Transpile packages to fix Turbopack and SSR issues
  transpilePackages: ['framer-motion', 'motion-dom', '@supabase/ssr'],

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
      {
        protocol: 'https',
        hostname: 'xcfqbwtlimgrkgpypzmj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
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



