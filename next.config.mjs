/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpileModules: ["antd"],
  transpilePackages: ["addBabel/runtime "],
};

export default nextConfig;
