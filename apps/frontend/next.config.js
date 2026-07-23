/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@netra/types', '@netra/config'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.catalyst.zoho.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
