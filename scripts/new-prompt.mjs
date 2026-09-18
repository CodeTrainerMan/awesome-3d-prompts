/**
 * Scaffolds a new prompt entry so contributing a model is a 30-second job
 * instead of copying an existing markdown file by hand.
 *
 * Usage: npm run new -- <category> <slug>
 *   e.g. npm run new -- characters cyberpunk-samurai
 *
 * Asset naming conventions (all files live next to the markdown):
 *   <slug>.png                reference / rendered image  (also used as the OG card)
 *   <slug>-<tool>.glb         one 3D result per tool, e.g. <slug>-hunyuan.glb
 *   <slug>.mp4                optional turntable preview
 * Run `npm run index` afterwards — the gallery picks everything up automatically.
 */
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PROMPTS_DIR = path.join(ROOT, 'prompts');

const [, , rawCategory, rawSlug] = process.argv;

if (!rawCategory || !rawSlug) {
  console.error('Usage: npm run new -- <category> <slug>');
  process.exit(1);
}

const category = rawCategory.trim().toLowerCase();
const slug = rawSlug
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-_]/g, '');

if (!slug) {
  console.error(`Invalid slug: ${rawSlug}`);
  process.exit(1);
}

const known = readdirSync(PROMPTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (!known.includes(category)) {
  console.error(`Unknown category "${category}". Known: ${known.join(', ')}`);
  process.exit(1);
}

const categoryDir = path.join(PROMPTS_DIR, category);
mkdirSync(categoryDir, { recursive: true });

const file = path.join(categoryDir, `${slug}.md`);
if (existsSync(file)) {
  console.error(`Already exists: prompts/${category}/${slug}.md`);
  process.exit(1);
}

const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const template = `# ${title}

**Author**: [@yourhandle](https://x.com/yourhandle)

<!--
Asset checklist — drop the files next to this markdown, then run \`npm run index\`:
  ${slug}.png            reference / rendered image (becomes the share card)
  ${slug}-hunyuan.glb    one GLB per tool, named <slug>-<tool>.glb
  ${slug}-tripo.glb
  ${slug}-meshy.glb
  ${slug}.mp4            optional turntable preview (best-performing asset on social)
Missing files are simply skipped by the gallery, so commit whenever you have one result.
-->

## Prompt

Paste the exact prompt text here. Keep it verbatim — the value of this repo is that
the prompt and the model next to it are provably the same input/output pair.

## Description

Optional: one or two sentences on what makes this case interesting
(why this prompt, what surprised you about the results).

## Process

1. **Image Generation**:
    - **Tool**: Gemini
    - **Output**: Reference image.
    ![Reference Image](${slug}.png)

2. **3D Generation**:
    - **Input**: The generated image above.
    - **Tool 1**: Hunyuan 3D
    - **Tool 2**: Tripo3D
    - **Tool 3**: Meshy AI

## Files

- **Reference Image**: [${slug}.png](${slug}.png)
- **Hunyuan 3D Model**: [${slug}-hunyuan.glb](${slug}-hunyuan.glb)

## Preview Link

[View 3D Model (Hunyuan 3D)](${slug}-hunyuan.glb)
`;

writeFileSync(file, template, 'utf8');

console.log(`[new] created prompts/${category}/${slug}.md`);
console.log('[new] next steps:');
console.log(`      1. add your assets to prompts/${category}/ (see the checklist in the file)`);
for (const index of ['README.md', 'README_ZH.md']) {
  const indexPath = path.join(categoryDir, index);
  console.log(
    `      2. link it from ${existsSync(indexPath) ? `prompts/${category}/${index}` : `prompts/${category}/${index} (does not exist yet — add the Chinese title here)`}`,
  );
}
console.log('      3. npm run index && npm run dev');
