import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable experimental features that might cause chunk loading issues
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: [],
  },
  
  // Simplified webpack configuration to fix chunk loading
  webpack: (config, { dev, isServer }) => {
    // Fix for chunk loading errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Disable aggressive chunk splitting that might cause issues
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
      },
    };
    
    return config;
  },
  
  // Disable React strict mode to avoid potential issues
  reactStrictMode: false,
  
  // Configure output for better chunk loading
  output: 'standalone',
  
  // Disable image optimization for now
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
