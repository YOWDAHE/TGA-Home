import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'backend',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // Add support for any localhost port
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tgagloballawfirm.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tgagloballawfirm.com',
        pathname: '/**',
      },
    ],
    // Add image optimization settings
    formats: ['image/webp', 'image/avif',],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add unoptimized option for development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Local dev only: in production nginx maps /api-backend to the backend's /api
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];
    const backend = (process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    return [{ source: '/api-backend/:path*', destination: `${backend}/api/:path*` }];
  },
  // Add headers for better caching
  async headers() {
    // The admin's page builder frames the previews; nothing else may
    const adminOrigins = (process.env.NEXT_PUBLIC_ADMIN_ORIGINS || '')
      .split(/[\s,]+/)
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean);
    return [
      {
        source: '/preview/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${["'self'", ...adminOrigins].join(' ')}`,
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // webpack(config) {
  //   // Add SVG support with @svgr/webpack for importing SVGs as React components
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     issuer: /\.[jt]sx?$/,
  //     use: ['@svgr/webpack'],
  //   });
  //   return config;
  // },
}

export default nextConfig;
