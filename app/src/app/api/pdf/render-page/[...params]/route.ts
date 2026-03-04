import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8000';
const CACHE_DIR = join(process.cwd(), '.cache', 'pdf-pages');

/**
 * PDF page rendering — proxies to the Docker PDF service with filesystem caching.
 *
 * URL pattern: /api/pdf/render-page/{version}/{pageNumber}
 * Example:     /api/pdf/render-page/sf861/0
 *
 * First checks a local file cache, then falls back to the PDF service.
 * Rendered PNGs are cached to disk so subsequent requests are instant.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  const segments = (await params).params;

  if (!segments || segments.length < 2) {
    return NextResponse.json(
      { error: 'Expected /render-page/{version}/{pageNumber}' },
      { status: 400 },
    );
  }

  const [version, pageNumStr] = segments;
  const pageNum = Number.parseInt(pageNumStr, 10);

  if (Number.isNaN(pageNum) || pageNum < 0) {
    return NextResponse.json(
      { error: `Invalid page number: ${pageNumStr}` },
      { status: 400 },
    );
  }

  // Check filesystem cache first
  const cacheFile = join(CACHE_DIR, version, `page-${pageNum}.png`);
  if (existsSync(cacheFile)) {
    const data = await readFile(cacheFile);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  }

  // Proxy to Docker PDF service
  try {
    const serviceUrl = `${PDF_SERVICE_URL}/render-page/${encodeURIComponent(version)}/${pageNum}`;
    const resp = await fetch(serviceUrl);

    if (!resp.ok) {
      return NextResponse.json(
        { error: `PDF service error: ${resp.status} ${resp.statusText}` },
        { status: resp.status },
      );
    }

    const pngBuffer = Buffer.from(await resp.arrayBuffer());

    // Cache to filesystem (non-blocking — don't fail if cache write fails)
    const cacheDir = join(CACHE_DIR, version);
    if (!existsSync(cacheDir)) {
      await mkdir(cacheDir, { recursive: true });
    }
    writeFile(cacheFile, pngBuffer).catch(() => {
      // Silently ignore cache write failures
    });

    return new NextResponse(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    console.error('[render-page] PDF service unreachable:', err);
    return NextResponse.json(
      { error: 'PDF service unavailable. Ensure the Docker PDF service is running.' },
      { status: 502 },
    );
  }
}
