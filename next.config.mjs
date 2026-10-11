const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000']
    }
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
