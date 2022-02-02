/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: { domains: ["api.iconify.design"] },
  crossOrigin: "anonymous",
}

module.exports = nextConfig
