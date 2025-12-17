// next.config.mjs
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ ADD THIS (IMPORTANT)
  turbopack: {},

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@popperjs/core/lib/popper-lite.js": require.resolve(
        "@popperjs/core/lib/popper.js"
      ),
    };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "trademe.datainovate.com",
        pathname: "/backend/storage/**",
      },
      {
        protocol: "https",
        hostname: "ma3rood.datainovate.com",
        pathname: "/backend/storage/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
    ],
  },

  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;


