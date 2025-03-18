/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: '/signin',
  //       destination: '/sign',
  //       permanent: true,
  //     },
  //   ]
  // },
}

module.exports = nextConfig 