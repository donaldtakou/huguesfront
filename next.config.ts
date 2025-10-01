import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Vercel
  output: 'standalone',
  
  // Optimisations pour la production
  images: {
    domains: ['localhost', 'your-backend-api.herokuapp.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuration des variables d'environnement
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || 'false',
  },
  
  // Gestion des erreurs de build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Compression et optimisations
  compress: true,
  poweredByHeader: false,
  
  // Configuration des redirections si nécessaire
  async redirects() {
    return [];
  },
  
  // Configuration des headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
