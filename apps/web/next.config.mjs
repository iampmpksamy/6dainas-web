/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output bundles only what's needed — no full node_modules in the Docker image
  output: 'standalone',
}

export default config
