
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /** Изолированная сборка: `NEXT_DIST_DIR=.next-isolated npm run build` (не пересекается с `next dev` в `.next`). */
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  experimental: {
    /** Меньше модулей в dev/SSR — ниже RAM и время компиляции */
    optimizePackageImports: [
      'lucide-react',
      '@mui/material',
      'date-fns',
      'recharts',
      'framer-motion',
    ],
  },
  // Rewrite /data/products.json → API для демо (когда файл отсутствует)
  async rewrites() {
    return [
      { source: '/data/products.json', destination: '/api/demo/products' },
    ];
  },
  async redirects() {
    return [
      { source: '/Syntha', destination: '/brand/organization', permanent: false },
      { source: '/syntha', destination: '/brand/organization', permanent: false },
    ];
  },
  // Пока `npm run typecheck` не зелёный, Next не валит сборку. CI: synth-1/.github/workflows/ci.yml.
  // Когда ошибок tsc не останется — поставьте ignoreBuildErrors: false.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // picsum.photos often redirects to fastly.picsum.photos
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Настройки для лучшей обработки изображений
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;

    
