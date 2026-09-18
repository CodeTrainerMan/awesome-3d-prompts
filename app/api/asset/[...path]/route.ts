import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { NextRequest } from 'next/server';

/**
 * Streams the binary assets kept in `prompts/` back to the browser.
 *
 * The repository intentionally keeps every GLB / PNG / MP4 next to its markdown
 * file, so nothing is duplicated into `public/` (that would add ~450 MB to every
 * checkout of the built app). Range requests are honoured so the browser can seek
 * inside preview videos.
 *
 * On serverless hosts (Vercel) the ~450 MB of binaries can not be bundled into
 * the function (250 MB limit), so the route redirects to an external CDN instead.
 * Locally `ASSET_BASE_URL` is unset and the files are streamed from disk.
 *
 * GET /api/asset/<category>/<file>
 */

const ASSET_ROOT = path.resolve(process.cwd(), 'prompts');

/** Override with any CDN that mirrors `prompts/` (S3, R2, jsDelivr, …). */
const DEFAULT_CDN = 'https://raw.githubusercontent.com/CodeTrainerMan/awesome-3d-prompts/main/prompts';

const ASSET_BASE_URL = (process.env.ASSET_BASE_URL ?? (process.env.VERCEL ? DEFAULT_CDN : undefined))?.replace(
  /\/+$/,
  '',
);

const CONTENT_TYPES: Record<string, string> = {
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function toWebStream(stream: Readable) {
  return Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const relative = decodeURIComponent(segments.join('/'));
  const absolute = path.resolve(ASSET_ROOT, relative);

  if (absolute !== ASSET_ROOT && !absolute.startsWith(ASSET_ROOT + path.sep)) {
    return new Response('Forbidden', { status: 403 });
  }

  if (ASSET_BASE_URL) {
    const suffix = request.nextUrl.pathname.replace(/^\/api\/asset\//, '');
    return new Response(null, {
      status: 307,
      headers: {
        Location: `${ASSET_BASE_URL}/${suffix}`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  let stats;
  try {
    stats = await stat(absolute);
  } catch {
    return new Response('Not found', { status: 404 });
  }
  if (!stats.isFile()) return new Response('Not found', { status: 404 });

  const contentType = CONTENT_TYPES[path.extname(absolute).toLowerCase()] ?? 'application/octet-stream';
  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Length': String(stats.size),
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
  });

  const range = request.headers.get('range');
  const match = range?.match(/bytes=(\d*)-(\d*)/);

  if (match) {
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stats.size) {
      return new Response('Range not satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${stats.size}` },
      });
    }

    headers.set('Content-Range', `bytes ${start}-${end}/${stats.size}`);
    headers.set('Content-Length', String(end - start + 1));

    return new Response(toWebStream(createReadStream(absolute, { start, end })), {
      status: 206,
      headers,
    });
  }

  return new Response(toWebStream(createReadStream(absolute)), { status: 200, headers });
}
