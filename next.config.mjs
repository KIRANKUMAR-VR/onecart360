/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Disable the Turbopack filesystem cache which causes stale chunk URLs
    // after dev server restarts, resulting in ChunkLoadError in the browser.
    turbopackFileSystemCacheForDev: false,
  },
}

export default nextConfig
