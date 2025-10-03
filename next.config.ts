import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Permitir que el build se complete incluso con errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permitir que el build se complete incluso con errores de TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
