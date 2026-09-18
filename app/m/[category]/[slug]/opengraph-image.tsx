import { ImageResponse } from 'next/og';
import { catalog, formatBytes } from '@/lib/catalog';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Awesome 3D Prompts model preview';

// Prerender once at build time: social crawlers give up quickly, so the card
// must not pay for a cold start plus a multi-megabyte CDN fetch at crawl time.
export const dynamic = 'force-static';

/**
 * Assets are not bundled into the deployed image (they live in `prompts/`), so the
 * card pulls its preview straight from the same CDN the /api/asset route redirects to.
 */
const CDN = 'https://raw.githubusercontent.com/CodeTrainerMan/awesome-3d-prompts/main/prompts';

const { models } = catalog;

async function loadPreview(category: string, file: string) {
  try {
    const res = await fetch(`${CDN}/${category}/${encodeURIComponent(file)}`);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    // Ignore anything huge — it would only slow the card down.
    if (buffer.byteLength > 8_000_000) return null;
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const model = models.find((m) => m.category === category && m.slug === slug);
  const title = (model?.title ?? '3D Prompt').slice(0, 60);
  const tools = (model?.tools ?? []).slice(0, 5);
  const preview = model?.preview ? await loadPreview(model.category, model.preview.file) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 630, height: 630, background: '#f4f5f7' }}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} width={630} height={630} style={{ objectFit: 'cover' }} alt="" />
          ) : (
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: 28,
              }}
            >
              {category}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '64px 60px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 22, color: '#9ca3af', letterSpacing: 2 }}>
              AWESOME 3D PROMPTS
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: title.length > 34 ? 52 : 64,
                fontWeight: 700,
                color: '#0a0a0a',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>

            {tools.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32 }}>
                {tools.map((tool) => (
                  <div
                    key={tool}
                    style={{
                      display: 'flex',
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: '1px solid #e5e5e5',
                      fontSize: 22,
                      color: '#525252',
                    }}
                  >
                    {tool}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 26, color: '#404040' }}>
              Compare {tools.length || 'AI'} model variants in the browser
            </div>
            <div style={{ display: 'flex', fontSize: 22, color: '#a3a3a3', marginTop: 10 }}>
              {model?.hasModel ? `${(model.variants ?? []).length} variants · ${formatBytes(model.modelSize)} GLB` : 'Prompt only'}
              {'  ·  3dprompts.club'}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
