/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["app", "ui", "lib"],
  },
};

module.exports = nextConfig;
