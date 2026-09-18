/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静态资源（GLB / 预览图 / 视频）保留在 prompts/ 目录，通过 route handler 读取，
  // 避免把数百 MB 的二进制复制进 public/。这里让 standalone 产物带上它们。
  outputFileTracingIncludes: {
    '/api/asset/**': ['./prompts/**'],
  },
};

export default nextConfig;
