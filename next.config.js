/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        os: false,
      };
      
      // Configure Konva for browser usage
      config.resolve.alias = {
        ...config.resolve.alias,
        'konva': require.resolve('konva'),
      };
    }
    return config;
  },
}

module.exports = nextConfig