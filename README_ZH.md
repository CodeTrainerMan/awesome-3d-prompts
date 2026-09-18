<p align="center">
  <img src="public/brand/mark.svg" width="96" alt="Awesome 3D Prompts logo" />
</p>

# Awesome 3D Prompts

[English](README.md) | 中文

---

一个收集高质量 3D 生成提示词（Prompts）的开源项目。

## 📖 项目简介

本项目致力于收集和整理优秀的 3D 生成提示词，帮助 3D 创作者、设计师和开发者快速找到适合的提示词，提高 3D 内容生成效率。

## 🎯 目标

- 收集高质量、实用的 3D 生成提示词
- 提供不同风格的提示词分类
- 持续更新和维护提示词库
- 为 3D 内容生成提供参考和灵感

## 🖥️ 在线画廊

仓库内置了一个基于 Next.js 的画廊站点，可以直接在浏览器里浏览所有已收录的模型：3D 在线预览（旋转/缩放）、同一提示词不同工具的版本对比、一键复制提示词、下载 GLB。

**在线地址：** [https://www.3dprompts.club](https://www.3dprompts.club)

本地运行：

```bash
npm install
npm run dev      # → http://localhost:3000
```

工作方式：

- `npm run index` 会扫描 `prompts/` 目录并重新生成 `data/models.json`（`dev` / `build` 前自动执行，新增提示词无需手动操作）。
- 二进制资源（`.glb` / `.png` / `.mp4`）保留在 markdown 旁边，通过 `GET /api/asset/<category>/<file>` 流式返回，不会复制进 `public/`。
- 部署到 Serverless 平台（如 Vercel）时，该路由会改为 307 重定向到 `ASSET_BASE_URL`：函数产物上限 250 MB，而 `prompts/` 约 450 MB。把该变量指向任意镜像了 `prompts/` 的 CDN 即可（默认使用 GitHub raw）。
- 每条 prompt 都有独立页面 `/m/<category>/<slug>`，自带 Open Graph 卡片，可以直接分享到社交平台并被搜索引擎收录。`/sitemap.xml` 与 `/robots.txt` 由构建自动生成。

生产构建：

```bash
npm run build
npm run start
```

## 📂 提示词分类

- [交通工具 (Vehicles)](prompts/vehicles/README.md)
- [武器 (Weapons)](prompts/weapons/README.md)
- [建筑 (Architecture)](prompts/architecture/README.md)
- [电子产品 (Electronics)](prompts/electronics/README.md)
- [家具 (Furniture)](prompts/furniture/README.md)
- [生活用品 (Household)](prompts/household/README.md)
- [工业 (Industrial)](prompts/industrial/README.md)
- [角色 (Characters)](prompts/characters/README.md)
- [动物 (Animals)](prompts/animals/README.md)
- [自然 (Nature)](prompts/nature/README.md)
- [食物 (Food)](prompts/food/README.md)
- [服饰 (Clothing)](prompts/clothing/README.md)

## 🔄 生成流程

### 1. Prompt → 3D

直接从文本提示词生成 3D 模型。

**工具**：
- [Hunyuan 3D](https://3d.hunyuan.tencent.com/)
- [Meshy AI](https://www.meshy.ai/)
- [Tripo AI](https://www.tripo3d.ai/)
- [Luma AI Genie](https://lumalabs.ai/genie)

### 2. Prompt → Image → 3D

两阶段流程：先生成图片，再转换为 3D 模型。

**图片生成工具**：
- [Gemini](https://gemini.google.com/)
- [Grok](https://grok.ai/)
- [ChatGPT](https://chatgpt.com/)

**图片转3D工具**：
- [Hunyuan 3D](https://3d.hunyuan.tencent.com/)
- [Meshy AI](https://www.meshy.ai/)
- [Stable Point Aware 3D](https://huggingface.co/spaces/stabilityai/stable-point-aware-3d)
- [Tripo AI](https://www.tripo3d.ai/)

## 💬 社区

- **微信**: CodeTrainer (回复 `3dprompts` 进群)
- **Telegram**: [https://t.me/prompts3D](https://t.me/prompts3D)

## 🤝 贡献

欢迎提交 Pull Request 来分享优秀的 3D 提示词！

请阅读我们的[贡献指南](CONTRIBUTING.md)了解行为准则和提交 Pull Request 的流程。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CodeTrainerMan/awesome-3d-prompts&type=Date)](https://star-history.com/#CodeTrainerMan/awesome-3d-prompts&Date)

如果这个项目对你有帮助，请考虑给它一个 Star！

---

**让我们一起构建最全面的 3D 提示词资源库！**

