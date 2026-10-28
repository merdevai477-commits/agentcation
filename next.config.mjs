/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Hide the Next.js route badge in development
  devIndicators: false,
  serverExternalPackages: ['@whiskeysockets/baileys', 'pino', 'qrcode', '@prisma/client'],
}

export default nextConfig
