/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/code-builder/:path*',
        destination: 'https://code-builder.vercel.app/:path*'
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
