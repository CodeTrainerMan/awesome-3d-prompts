/**
 * Scans the `prompts/` directory and generates `data/models.json`,
 * the single source of truth consumed by the gallery UI.
 *
 * The repository keeps GLB / PNG / MP4 binaries next to the markdown files.
 * Nothing is copied into `public/`; the web app streams them through
 * `GET /api/asset/<path>` instead.
 *
 * Run: npm run index  (also executed automatically before dev / build)
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PROMPTS_DIR = path.join(ROOT, 'prompts');
const OUT_FILE = path.join(ROOT, 'data', 'models.json');

const CATEGORY_ORDER = [
  'characters',
  'animals',
  'architecture',
  'vehicles',
  'weapons',
  'electronics',
  'furniture',
  'household',
  'industrial',
  'nature',
  'food',
  'clothing',
];

const CATEGORY_EMOJI = {
  characters: '🧑‍🚀',
  animals: '🦖',
  architecture: '🏰',
  vehicles: '🚀',
  weapons: '🛡️',
  electronics: '🥽',
  furniture: '🪑',
  household: '🏠',
  industrial: '🏭',
  nature: '🌿',
  food: '🍔',
  clothing: '👕',
};

/** Fallback Chinese labels when a category has no README_ZH.md heading. */
const CATEGORY_LABEL_FALLBACK = {
  characters: '角色',
  animals: '动物',
  architecture: '建筑',
  vehicles: '载具',
  weapons: '武器',
  electronics: '电子设备',
  furniture: '家具',
  household: '家居',
  industrial: '工业',
  nature: '自然',
  food: '食物',
  clothing: '服饰',
};

const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.webp'];

function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1');
}

function parseAuthorField(raw) {
  if (!raw) return null;
  const name = raw.trim();
  if (!name || /^community$/i.test(name)) return null;
  const urlMatch = name.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (urlMatch) {
    return { name: urlMatch[1].trim(), url: urlMatch[2].trim() };
  }
  return { name, url: null };
}

function sectionBody(md, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^#{1,3}\\s*${escaped}\\s*$`, 'im');
  const match = md.match(re);
  if (!match || match.index === undefined) return null;
  const start = match.index + match[0].length;
  const nextHeading = md.slice(start).search(/^#{1,3}\s+\S/m);
  const body = nextHeading === -1 ? md.slice(start) : md.slice(start, start + nextHeading);
  return body.trim();
}

function collectTools(md) {
  const tools = new Set();
  const re = /\*\*Tool\s*\d*\s*\*\*\s*:\s*(.+)/gi;
  let m;
  while ((m = re.exec(md))) {
    const value = stripMarkdownLinks(m[1])
      .replace(/\s*\((?:Image|Text)\s*to\s*3D\)/gi, '')
      .replace(/\s*\((?:Image|Text)\s*to\s*Image\)/gi, '')
      .replace(/[*_`]/g, '')
      .trim();
    if (value) tools.add(value);
  }
  // Some files list tools as numbered steps instead of a "**Tool**:" pair,
  // e.g. "1. **Tripo AI**"
  const process = sectionBody(md, 'Process');
  if (process) {
    const stepRe = /^\s*\d+\.\s*\*\*([^*]+)\*\*\s*$/gm;
    let s;
    while ((s = stepRe.exec(process))) {
      const value = s[1].trim();
      if (value && !/^(generation|3d generation|image generation)$/i.test(value)) tools.add(value);
    }
  }

  // Fallback: tools declared inside the file list, e.g. "- **Meshy AI Model**: [x.glb](x.glb)"
  const fileRe = /\*\*(.+?)\s+Model\*\*\s*:/gi;
  while ((m = fileRe.exec(md))) {
    const value = m[1].trim();
    if (value && !/^(3D|3d)$/.test(value)) tools.add(value);
  }
  return [...tools];
}

/** Derive a short human label for a GLB link. */
function variantLabel(linkText, filePath) {
  const text = (linkText || '').trim();
  let m = text.match(/View 3D Model\s*\(([^)]+)\)/i);
  if (m) return m[1].trim();
  if (/^3d model$/i.test(text)) return null;
  if (/^view\b/i.test(text)) return null;
  m = text.match(/^(.*?)\s*Model$/i);
  if (m && m[1].trim()) return m[1].trim();
  if (text && !/^view/i.test(text)) return text;
  return null;
}

function collectLinked(md, extensions) {
  const seen = new Map();
  const re = /\[([^\]]*)\]\(([^)\s]+\.(\w+))\)/gi;
  let m;
  while ((m = re.exec(md))) {
    const rawFile = decodeURIComponent(m[2]).replace(/^\.\//, '');
    const ext = path.extname(rawFile).toLowerCase();
    if (!extensions.includes(ext)) continue;
    if (/^(https?:)?\/\//i.test(rawFile)) continue;
    const previous = seen.get(rawFile);
    // The same file is usually listed twice: once in "## Files" (link text = file
    // name) and once in "## Preview Link" (link text = "<Tool> Model").
    // Prefer the descriptive occurrence.
    if (!previous || (!isInformative(previous.text, rawFile) && isInformative(m[1], rawFile))) {
      seen.set(rawFile, { text: m[1], file: rawFile });
    }
  }
  return [...seen.values()];
}

function isInformative(text, file) {
  const value = (text || '').trim();
  if (!value) return false;
  if (value === file || value === path.basename(file)) return false;
  return true;
}

/** "musk-ironman-myshy" -> "Myshy" */
function humanize(suffix) {
  const cleaned = suffix.replace(/[-_]+/g, ' ').trim();
  if (!cleaned) return null;
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickPreview(md, slug, dirEntries) {
  const images = collectLinked(md, IMAGE_EXT).filter((img) => dirEntries.includes(img.file));
  if (!images.length) return null;

  const byName = images.find(
    (img) => path.basename(img.file, path.extname(img.file)).toLowerCase() === slug.toLowerCase(),
  );
  if (byName) return byName;

  const Generated = images.find((img) => !/referen/i.test(img.file) && !/referen/i.test(img.text));
  return Generated || images[0];
}

function pickVideo(md, dirEntries) {
  const videos = collectLinked(md, ['.mp4', '.webm']).filter((v) => dirEntries.includes(v.file));
  return videos[0] || null;
}

/** Read bilingual metadata exposed by each category's README / README_ZH index files. */
async function readCategoryIndexes(categoryDir) {
  const meta = { labelZh: null, titlesZh: new Map() };

  const zhPath = path.join(categoryDir, 'README_ZH.md');
  try {
    const zh = await readFile(zhPath, 'utf8');
    const heading = zh.match(/^#\s+(.+)$/m);
    if (heading) {
      meta.labelZh = heading[1]
        .replace(/\s*\([^)]*\)\s*$/, '')
        .replace(/提示词$|作品列表$/, '')
        .trim();
    }
    const linkRe = /[-*]\s*\[([^\]]+)\]\(([^)]+\.md)\)/g;
    let m;
    while ((m = linkRe.exec(zh))) {
      const label = m[1].trim();
      const titleMatch = label.match(/^(.*?)\s*[（(]([^）)]+)[）)]\s*$/);
      const file = path.basename(m[2]);
      if (titleMatch) {
        meta.titlesZh.set(file, titleMatch[2].trim());
      }
    }
  } catch {
    /* no README_ZH.md — fall back to English only */
  }

  const enPath = path.join(categoryDir, 'README.md');
  try {
    const en = await readFile(enPath, 'utf8');
    const heading = en.match(/^#\s+(.+)$/m);
    if (heading) {
      meta.labelEn = heading[1].replace(/Prompts\s*$/i, '').trim() || null;
    }
  } catch {
    /* ignore */
  }

  return meta;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 100 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

async function fileSize(file) {
  try {
    return (await stat(file)).size;
  } catch {
    return 0;
  }
}

async function parsePromptFile(entry) {
  const { categoryDir, category, file, categoryLinked } = entry;
  const md = await readFile(path.join(categoryDir, file), 'utf8');
  const slug = path.basename(file, '.md');
  const dirEntries = await readdir(categoryDir);

  const heading = md.match(/^#\s+(.+)$/m);
  const rawTitle = heading ? heading[1].trim() : slug;
  // Titles sometimes carry an inline Chinese translation: "Jensen Huang Jacket (黄仁勋夹克)"
  const inlineZh = rawTitle.match(/^(.*?)\s*[（(]([^）)]+)[）)]\s*$/);
  const hasCjk = (value) => /[㐀-䶿一-鿿]/.test(value);
  const title = inlineZh && hasCjk(inlineZh[2]) ? inlineZh[1].trim() : rawTitle;
  const inlineTitleZh = inlineZh && hasCjk(inlineZh[2]) ? inlineZh[2].trim() : null;

  const authorRaw = md.match(/\*\*Author\*\*\s*:\s*(.+)/i);
  const author = parseAuthorField(authorRaw ? authorRaw[1] : null);

  const prompt = (sectionBody(md, 'Prompt') || '').trim();
  const description = (sectionBody(md, 'Description') || '').trim();

  const variantsRaw = collectLinked(md, ['.glb']);
  const variants = [];
  for (const v of variantsRaw) {
    variants.push({
      file: v.file,
      label: variantLabel(v.text, v.file),
      size: dirEntries.includes(v.file) ? await fileSize(path.join(categoryDir, v.file)) : 0,
      exists: dirEntries.includes(v.file),
    });
  }

  // Some prompts were contributed without a "Files" section even though the GLB sits
  // right next to the markdown. Pick those up by filename convention.
  const prefix = `${slug.toLowerCase()}-`;
  for (const file of dirEntries) {
    if (!file.toLowerCase().endsWith('.glb') || categoryLinked.has(file)) continue;
    const stem = path.basename(file, '.glb').toLowerCase();
    if (stem !== slug.toLowerCase() && !stem.startsWith(prefix)) continue;
    const suffix = stem.startsWith(prefix) ? stem.slice(prefix.length) : '';
    variants.push({
      file,
      label: suffix ? humanize(suffix) : null,
      size: await fileSize(path.join(categoryDir, file)),
      exists: true,
    });
  }

  const preview = pickPreview(md, slug, dirEntries);
  const video = pickVideo(md, dirEntries);

  const previewSize = preview ? await fileSize(path.join(categoryDir, preview.file)) : 0;
  const videoSize = video ? await fileSize(path.join(categoryDir, video.file)) : 0;

  const available = variants.filter((v) => v.exists);

  return {
    id: `${category}/${slug}`,
    slug,
    category,
    title,
    author,
    prompt,
    description: description || null,
    inlineTitleZh,
    tools: collectTools(md),
    preview: preview ? { file: preview.file, size: previewSize } : null,
    video: video ? { file: video.file, size: videoSize } : null,
    variants,
    availableVariantCount: available.length,
    modelSize: available.reduce((sum, v) => sum + v.size, 0),
    hasModel: available.length > 0,
  };
}

async function main() {
  const categoriesRaw = (await readdir(PROMPTS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });

  const models = [];
  const categories = [];

  for (const category of categoriesRaw) {
    const categoryDir = path.join(PROMPTS_DIR, category);
    const files = (await readdir(categoryDir))
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .filter((f) => !/^readme/i.test(f));

    const index = await readCategoryIndexes(categoryDir);

    // GLB files explicitly referenced by *any* prompt in this category, so the
    // filename fallback below cannot steal a file that belongs to its neighbour.
    const categoryLinked = new Set();
    for (const file of files) {
      const content = await readFile(path.join(categoryDir, file), 'utf8');
      for (const v of collectLinked(content, ['.glb'])) categoryLinked.add(v.file);
    }

    const entries = [];
    for (const file of files) {
      try {
        entries.push(await parsePromptFile({ categoryDir, category, file, categoryLinked }));
      } catch (err) {
        console.warn(`[index] skipped ${category}/${file}: ${err.message}`);
      }
    }

    models.push(
      ...entries.map(({ inlineTitleZh, ...entry }) => ({
        ...entry,
        titleZh: index.titlesZh.get(`${entry.slug}.md`) ?? inlineTitleZh ?? null,
      })),
    );

    categories.push({
      id: category,
      label: index.labelEn || category,
      labelZh: index.labelZh || CATEGORY_LABEL_FALLBACK[category] || category,
      emoji: CATEGORY_EMOJI[category] || '📦',
      count: entries.length,
      modelCount: entries.filter((e) => e.hasModel).length,
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    categories,
    models,
    stats: {
      models: models.length,
      previewable: models.filter((m) => m.hasModel).length,
      categories: categories.length,
      totalBytes: models.reduce((sum, m) => sum + m.modelSize, 0),
    },
  };

  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(
    `[index] ${models.length} prompts / ${categories.length} categories -> data/models.json (${formatBytes(
      payload.stats.totalBytes,
    )} of GLB)`,
  );
  for (const c of categories) {
    console.log(`[index]   ${c.emoji} ${c.id.padEnd(14)} ${c.labelZh.padEnd(8)} ${c.count}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
