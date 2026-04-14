/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Garante que sw.js seja servido com os headers corretos
        // PWABuilder e browsers exigem Content-Type correto e sem cache
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
}

export default nextConfig
