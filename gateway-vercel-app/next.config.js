/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    middleware: true,
  },
  async rewrites() {
    return [
      {
        source: '/app1/:path*',
        destination: 'https://app1-xxx.vercel.app/:path*'
      },
      {
        source: '/app2/:path*',
        destination: 'https://app2-yyy.vercel.app/:path*'
      }
      // ajoute d'autres apps si nécessaire
    ];
  },
};
module.exports = nextConfig;