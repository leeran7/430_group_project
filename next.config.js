/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "media.rawg.io"],
  },
  env: {
    RAWG_API_KEY: process.env.RAWG_API_KEY,
  },
};

module.exports = nextConfig;
