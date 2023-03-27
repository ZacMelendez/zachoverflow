/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: ["localhost"],
  },
  experimental: {
    optimizeCss: true,
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

const removeImports = require("next-remove-imports")();
module.exports = removeImports({});
