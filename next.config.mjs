/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir cross-origin requests para desarrollo
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  // Configurar orígenes permitidos para desarrollo
  allowedDevOrigins: [
    '192.168.1.90',
    'localhost',
    '127.0.0.1',
  ],
  // Nueva configuración para Turbopack
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // PWA para funcionar como app móvil
  images: {
    domains: ['localhost', '192.168.1.90'],
  },
  // Transpilar módulos ES
  transpilePackages: ['mongoose'],
}

export default nextConfig;