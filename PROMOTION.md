# Promotion Playbook

推广执行手册。目标不是"让仓库被看到"，而是**让每一条对照都成为一个可分享的原子内容**，再把这些原子内容持续投放到会转发它的渠道。

## 1. 定位（所有文案的第一句话都从这里长出来）

> 同一个 prompt，5 款主流 AI 3D 工具（Hunyuan 3D / Tripo / Meshy / Hitem3d / Gemini）各自生成的真实模型，放在一起旋转对比，还能下载 GLB 看体积和拓扑差异。

差异化只有这一条：**不是 awesome 列表，是带证据的横向评测**。
所以任何渠道文案都要落在"对比结果"上，而不是"我们收集了 N 条提示词"。

## 2. 基线（每次复盘先更新这张表）

| 指标 | 起始值 | 当前 | 月度目标 |
|---|---|---|---|
| Prompt 条目 | 13 | | 40+ |
| 有内容的分类 | 8 / 12 | | 12 / 12 |
| GitHub stars | | | 100+ |
| 站点 UV | | | 2,000+ |
| 社群成员（微信 + TG） | | | 50+ |
| 工具官方账号转发 | 0 | | ≥1 |

数据从 `data/models.json` 直接读：`npm run index && node -e "..."`，或看站点首屏统计（已与真实可见分类对齐）。

## 3. P0 基建（已完成 ✅）

- [x] `/m/<category>/<slug>` 独立详情页，13 条全部 SSG，可被搜索引擎收录
- [x] 每条自动生成 Open Graph 卡片（真实渲染图 + 工具标签 + 体积），构建时预渲染
- [x] `sitemap.xml` / `robots.txt` / canonical / OG / Twitter 元数据
- [x] Vercel Analytics（渠道归因）
- [x] 卡片是真链接：普通点击开弹窗，中键/新标签/爬虫拿到真实 URL
- [x] 隐藏空分类，统计口径与可点击分类数一致
- [x] 详情页内"分享 / 复制链接 / 查看源文件"入口

**结论：现在具备推广条件。** 但内容量仍是短板——13 条去打大渠道会被判定为"样板间"，而冷启动流量是一次性的。

## 4. P1 内容打底（第 1–4 周，最高优先级）

硬指标：**40–60 条，12 个分类每类 ≥3 条**。这是 Product Hunt / HN / V2EX 的最低入场券。

- 节奏：每周 8–10 条。瓶颈是"跑工具"的时间，不是写文档。
- 优先补 4 个空分类：`household` / `industrial` / `nature` / `food`。空分类是首屏转化杀手。
- 每条必须填 `author`（带 X / 主页链接）——作者就是天然传播节点，发布时 @ 他。
- 每条尽量产出：1 张参考图 + ≥3 个工具的 GLB + 1 段旋转 mp4。mp4 是所有社交渠道的通用货币。

新建条目用脚手架，避免手工抄格式：

```bash
npm run new -- characters my-new-model
```

它会生成 `prompts/<category>/<slug>.md` 骨架（Prompt / Process / Files / Preview Link 四段），资产命名约定写在模板注释里：`<slug>-<tool>.glb`、`<slug>.png`、`<slug>.mp4`，跑 `npm run index` 即可被自动识别。

## 5. P2 渠道打法（≥40 条后，按 ROI 顺序）

### 5.1 X / Twitter —— 杠杆最大，最先做

每发布一条就发一条推文，并 **@ 对应工具的官方账号**。对 Hunyuan 3D、Tripo、Meshy 来说，这是免费的第三方效果展示，转发率最高。

模板：

```
Same prompt, 5 AI 3D tools. Which one wins?

"<prompt 前 60 字>…"

Rotate all 5 in the browser, download the GLBs:
https://www.3dprompts.club/m/<category>/<slug>

@Hunyuan3D @TripoAI @MeshyAI @Hitem3D
```

要点：必须带 mp4（旋转视频的完播率远高于文字）；一条 prompt 一条推，不要合并成"我们更新了 10 条"。

### 5.2 GitHub 生态 —— 免费长期流量，成本最低

- [ ] 仓库 topics：`3d` `prompts` `glb` `generative-ai` `ai-3d` `awesome-list` `3d-modeling`（网页端 Settings → Topics，本机无 `gh` CLI）
- [ ] 向低门槛列表提 PR：`awesome-3d`、`awesome-generative-ai`、`awesome-ai-3d`
- [ ] `sindresorhus/awesome` 留到最后——门槛高，内容不足会被拒且留下记录

### 5.3 垂直社区 —— 先贡献，再发

Reddit `r/3Dmodeling` / `r/Blender`、Blender Artists、Polycount、各工具 Discord 的 showcase 频道。
这些社区普遍反 self-promo。姿态必须是"我做了个对照实验，数据在这里，欢迎挑错"，而不是"来看看我的项目"。

Reddit 模板：

```
I ran the same prompt through 5 AI 3D generators and compared the actual GLB output

Method: one image prompt → Gemini → then Hunyuan 3D / Tripo / Meshy / Hitem3d.
All models are previewable in-browser and downloadable, sizes and topology included: <link>

Biggest surprise: <一条真实观察，例如哪个工具体积最小/拓扑最干净>
Happy to add any tool you want to see — it's an open repo.
```

### 5.4 Product Hunt —— 40+ 条之后再打

PH 首页 80% 的效果取决于素材。我们有现成的旋转视频和对比图，这是优势。
发布前准备好：30 秒产品视频、5 张 gallery 图、first comment 讲清"为什么做这个"。

### 5.5 中文渠道

- 小红书：天然适合"同一 prompt，5 个 AI 谁最强"的对比图文。标题带具体数字和悬念，正文放链接。
- 掘金 / 即刻 / V2EX 创意节点：发"我们跑了 40 条 prompt 后的观察"这类带结论的文章，不要发纯项目公告。

### 5.6 私域承接

站点首屏已有微信（CodeTrainer，回复 `3dprompts`）和 TG（https://t.me/prompts3D）入口。
**每篇对外内容结尾都要留承接入口**，否则流量看过即走。

## 6. P3 放大飞轮

- 让工具方自己投稿：好结果就是他们最好的广告位，持续供稿形成 UGC 飞轮
- 「每周 3D Prompt」周报（RSS / 邮件），把一次性访客变回访
- 里程碑晒 star history 二次传播

## 7. 每周复盘（周五 30 分钟）

1. 更新第 2 节基线表
2. Vercel Analytics 看来源拆分：哪个渠道带来 UV、停留时长、GLB 下载次数
3. 只保留有转化的渠道，加倍投入；零转化的渠道停掉
4. 下周只排 3 件事：内容 N 条 / 渠道 X / 一件事的实验

原则：**不归因就不投放**。任何渠道没打 UTM 就不算数。
