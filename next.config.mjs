/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静态资源（GLB / 预览图 / 视频）保留在 prompts/ 目录，通过 route handler 读取，
  // 避免把数百 MB 的二进制复制进 public/。
  //
  // Serverless 平台对函数体积有 250 MB 上限，因此默认不把 prompts/ 打包进产物：
  // 部署时 /api/asset 会 307 重定向到 ASSET_BASE_URL 指向的 CDN。
  // 只有自建 / standalone 部署（ASSET_EMBED=1）才需要把资源一起打包。
  ...(process.env.ASSET_EMBED
    ? { outputFileTracingIncludes: { '/api/asset/**': ['./prompts/**'] } }
    : {}),
};

export default nextConfig;
