# Contributing to Awesome 3D Prompts

Thank you for your interest in contributing to Awesome 3D Prompts! 🎉

[English](#english) | [中文](#中文)

---

## English

### How to Contribute

We welcome contributions of all kinds! Here are some ways you can help:

- 🎨 Add new 3D generation prompts
- 📝 Improve existing prompts
- 🐛 Fix errors or typos
- 📚 Improve documentation
- 🌟 Suggest new categories or features

### Contribution Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/awesome-3d-prompts.git
   cd awesome-3d-prompts
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the [prompt format guidelines](#prompt-format)
   - Ensure your prompts are high-quality and tested
   - Add prompts to the appropriate category directory

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your contribution"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Prompt Format

`npm run index` turns these files into the gallery, so the headings matter — this is
the structure the parser actually reads:

```markdown
# Title

**Author**: [@yourhandle](https://x.com/yourhandle)

## Prompt

[The exact prompt text, verbatim]

## Description

[Optional: why this case is interesting]

## Process

1. **Image Generation**:
    - **Tool**: Gemini
    ![Reference Image](my-model.png)

2. **3D Generation**:
    - **Tool 1**: Hunyuan 3D
    - **Tool 2**: Tripo3D

## Files

- **Reference Image**: [my-model.png](my-model.png)
- **Hunyuan 3D Model**: [my-model-hunyuan.glb](my-model-hunyuan.glb)

## Preview Link

[View 3D Model (Hunyuan 3D)](my-model-hunyuan.glb)
```

Scaffold it instead of copy-pasting:

```bash
npm run new -- characters my-model
```

### Asset Naming

Binaries live next to the markdown; nothing is copied into `public/`:

- `my-model.png` — reference / rendered image (also becomes the share card)
- `my-model-<tool>.glb` — one result per tool, e.g. `my-model-hunyuan.glb`
- `my-model.mp4` — optional turntable preview (the best-performing asset on social)

Files that are not present are simply skipped, so it is fine to open a PR with a
single tool result and add the rest later.

### Guidelines

1. **Quality over quantity** - Only submit prompts you've tested
2. **Be descriptive** - Include parameters, variations, and use cases
3. **Follow structure** - Use the standard format for consistency
4. **Add tags** - Help others find your prompts
5. **Test before submitting** - Ensure prompts work with recommended tools

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's guidelines

---

## 中文

### 如何贡献

我们欢迎各种形式的贡献！以下是一些帮助方式：

- 🎨 添加新的 3D 生成提示词
- 📝 改进现有提示词
- 🐛 修复错误或拼写错误
- 📚 改进文档
- 🌟 建议新分类或功能

### 贡献流程

1. **Fork 仓库**
   ```bash
   git clone https://github.com/your-username/awesome-3d-prompts.git
   cd awesome-3d-prompts
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行更改**
   - 遵循[提示词格式指南](#prompt-format)
   - 确保你的提示词高质量且经过测试
   - 将提示词添加到适当的分类目录

4. **提交更改**
   ```bash
   git add .
   git commit -m "Add: 你的贡献描述"
   ```

5. **推送并创建 Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### 提示词格式

`npm run index` 会把这些文件解析成画廊，所以标题结构必须一致——以下是解析器实际读取的字段：

```markdown
# 标题

**Author**: [@你的主页](https://x.com/你的主页)

## Prompt

[逐字粘贴的原始提示词]

## Description

[可选：这条为什么有意思]

## Process

1. **Image Generation**:
    - **Tool**: Gemini
    ![Reference Image](my-model.png)

2. **3D Generation**:
    - **Tool 1**: Hunyuan 3D
    - **Tool 2**: Tripo3D

## Files

- **Reference Image**: [my-model.png](my-model.png)
- **Hunyuan 3D Model**: [my-model-hunyuan.glb](my-model-hunyuan.glb)

## Preview Link

[View 3D Model (Hunyuan 3D)](my-model-hunyuan.glb)
```

不用手抄，直接生成骨架：

```bash
npm run new -- characters my-model
```

### 文件命名

二进制文件放在 markdown 旁边，不会复制进 `public/`：

- `my-model.png` —— 参考图/渲染图（同时作为分享卡片）
- `my-model-<tool>.glb` —— 每个工具一个结果，如 `my-model-hunyuan.glb`
- `my-model.mp4` —— 可选旋转预览（社交平台上效果最好的素材）

缺失的文件会被自动跳过，所以只有单个工具结果也可以先提 PR，之后再补。

### 指南

1. **质量胜过数量** - 只提交你测试过的提示词
2. **详细描述** - 包含参数、变体和用例
3. **遵循结构** - 使用标准格式保持一致性
4. **添加标签** - 帮助他人找到你的提示词
5. **提交前测试** - 确保提示词在推荐工具中可用

### 行为准则

- 尊重和包容
- 提供建设性反馈
- 帮助他人学习和成长
- 遵循项目指南

---

Thank you for contributing! 🙏
