import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features that might help with React 19 compatibility
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  
  // Webpack configuration for Three.js
  webpack: (config, { isServer }) => {
    // Handle Three.js modules properly
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/',
        },
      },
    });

    // Ensure React Three Fiber works with React 19
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
