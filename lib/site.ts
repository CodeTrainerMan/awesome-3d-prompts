export const SITE = {
  name: 'Awesome 3D Prompts',
  /** Canonical origin, no trailing slash. Used for sitemap / OG absolute URLs. */
  url: 'https://www.3dprompts.club',
  repo: 'https://github.com/CodeTrainerMan/awesome-3d-prompts',
  tagline: '3D 生成提示词与真实生成结果的开源对照库',
  description:
    '收录验证过的 3D 生成提示词，以及 Hunyuan 3D、Tripo、Meshy、Hitem3d、Gemini 等工具产出的真实模型。在浏览器里旋转预览 GLB、横向对比不同工具的版本，并一键复制背后的完整提示词。',
  twitter: '@CodeTrainerMan',
};

/** `/m/<category>/<slug>` — the shareable deep link for a single entry. */
export function modelPath(model: { category: string; slug: string }) {
  return `/m/${model.category}/${model.slug}`;
}

export function absoluteUrl(pathname: string) {
  return `${SITE.url}${pathname}`;
}
