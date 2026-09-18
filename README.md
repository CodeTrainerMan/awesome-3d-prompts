<p align="center">
  <img src="public/brand/mark.svg" width="96" alt="Awesome 3D Prompts logo" />
</p>

# Awesome 3D Prompts

English | [中文](README_ZH.md)

---

An open-source project for collecting high-quality 3D generation prompts.

## 📖 Introduction

This project is dedicated to collecting and organizing excellent 3D generation prompts, helping 3D creators, designers, and developers quickly find suitable prompts to improve 3D content generation efficiency.

## 🎯 Goals

- Collect high-quality and practical 3D generation prompts
- Provide prompt classifications in different styles
- Continuously update and maintain the prompt library
- Provide references and inspiration for 3D content generation

## 🖥️ Web Gallery

The repository ships with a built-in Next.js gallery that renders every collected model in the browser — orbit/zoom 3D previews, side-by-side comparison of different generation tools, one-click prompt copy and GLB download.

**Live site:** [https://www.3dprompts.club](https://www.3dprompts.club)

Run it locally:

```bash
npm install
npm run dev      # → http://localhost:3000
```

How it works:

- `npm run index` scans `prompts/` and regenerates `data/models.json` (run automatically before `dev` / `build` — no manual step when you add new prompts).
- Binary assets (`.glb` / `.png` / `.mp4`) stay next to the markdown files and are streamed by `GET /api/asset/<category>/<file>`, so nothing is duplicated into `public/`.
- On serverless hosts (Vercel) the same route 307-redirects to `ASSET_BASE_URL` instead: function bundles cap at 250 MB while `prompts/` holds ~450 MB. Point the variable at any CDN mirroring `prompts/` (defaults to the GitHub raw mirror).
- Every prompt gets its own page at `/m/<category>/<slug>` with a generated Open Graph card, so a single entry can be shared on social media and indexed by search engines. `/sitemap.xml` and `/robots.txt` are generated at build time.

Production build:

```bash
npm run build
npm run start
```

## 📂 Prompt Categories

- [Vehicles](prompts/vehicles/README.md)
- [Weapons](prompts/weapons/README.md)
- [Architecture](prompts/architecture/README.md)
- [Electronics](prompts/electronics/README.md)
- [Furniture](prompts/furniture/README.md)
- [Household](prompts/household/README.md)
- [Industrial](prompts/industrial/README.md)
- [Characters](prompts/characters/README.md)
- [Animals](prompts/animals/README.md)
- [Nature](prompts/nature/README.md)
- [Food](prompts/food/README.md)
- [Clothing](prompts/clothing/README.md)

## 🔄 Generation Workflows

### 1. Prompt → 3D

Direct generation from text prompts to 3D models.

**Tools**:
- [Hunyuan 3D](https://3d.hunyuan.tencent.com/)
- [Meshy AI](https://www.meshy.ai/)
- [Tripo AI](https://www.tripo3d.ai/)
- [Luma AI Genie](https://lumalabs.ai/genie)

### 2. Prompt → Image → 3D

Two-stage workflow: generate images first, then convert to 3D models.

**Image Generation Tools**:
- [Gemini](https://gemini.google.com/)
- [Grok](https://x.ai/)
- [ChatGPT](https://chatgpt.com/)

**Image to 3D Tools**:
- [Hunyuan 3D](https://3d.hunyuan.tencent.com/)
- [Meshy AI](https://www.meshy.ai/)
- [Stable Point Aware 3D](https://huggingface.co/spaces/stabilityai/stable-point-aware-3d)
- [Tripo AI](https://www.tripo3d.ai/)

## 💬 Community

- **WeChat**: CodeTrainer (Reply `3dprompts` to join the group)
- **Telegram**: [https://t.me/prompts3D](https://t.me/prompts3D)

## 🤝 Contributing

Pull requests are welcome! Feel free to share your excellent 3D prompts!

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CodeTrainerMan/awesome-3d-prompts&type=Date)](https://star-history.com/#CodeTrainerMan/awesome-3d-prompts&Date)

If this project helps you, please consider giving it a Star!

---

**Let's build the most comprehensive 3D prompt resource library together!**
