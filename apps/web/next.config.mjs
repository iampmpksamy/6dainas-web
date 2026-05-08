/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output bundles only what's needed — no node_modules in the Docker runtime image
  output: 'standalone',

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // www → apex canonical redirect (backup — Caddy also handles this)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.6dainas.cloud' }],
        destination: 'https://6dainas.cloud/:path*',
        permanent: true,
      },
    ]
  },
}

export default config
