/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Reduce worker threads to avoid Windows issues
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig
