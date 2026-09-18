import { ImageResponse } from 'next/og';
import { catalog, formatBytes } from '@/lib/catalog';
import { SITE } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Awesome 3D Prompts';

export default function Image() {
  const { stats } = catalog;

  const metrics = [
    ['Prompts', String(stats.models)],
    ['Previewable models', String(stats.previewable)],
    ['Categories', String(stats.categories)],
    ['Downloadable GLB', formatBytes(stats.totalBytes)],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '72px 76px',
          background: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, color: '#9ca3af', letterSpacing: 3 }}>
          AWESOME 3D PROMPTS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 76,
              fontWeight: 700,
              color: '#0a0a0a',
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            One prompt.
            <br />
            Five AI tools. Real GLB.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#525252', marginTop: 28 }}>
            Compare outputs from Hunyuan 3D, Tripo, Meshy, Hitem3d and Gemini side by side.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 56 }}>
          {metrics.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#0a0a0a' }}>{value}</div>
              <div style={{ display: 'flex', fontSize: 22, color: '#9ca3af', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: '#a3a3a3' }}>{SITE.url.replace('https://', '')}</div>
      </div>
    ),
    size,
  );
}
