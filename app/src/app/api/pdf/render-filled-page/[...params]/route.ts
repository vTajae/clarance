import { NextRequest, NextResponse } from 'next/server';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8000';

/**
 * Live PDF preview — proxies to the Docker PDF service.
 *
 * URL pattern: POST /api/pdf/render-filled-page/{version}/{pageNumber}?dpi=72
 * Body:        { field_values: Record<string, string> }
 * Returns:     PNG image of the page with field values baked in.
 *
 * Only useful in development mode (the Docker PDF service must be running).
 * In production (Cloudflare), this returns 501 since there's no PDF service.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  const segments = (await params).params;

  if (!segments || segments.length < 2) {
    return NextResponse.json(
      { error: 'Expected /render-filled-page/{version}/{pageNumber}' },
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

  // Parse DPI from query string (default 72)
  const dpi = Number.parseInt(request.nextUrl.searchParams.get('dpi') ?? '72', 10);

  // Read the JSON body with field values
  let body: { field_values?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const fieldValues = body.field_values ?? {};

  // Proxy to Docker PDF service
  try {
    const serviceUrl = `${PDF_SERVICE_URL}/render-filled-page/${encodeURIComponent(version)}/${pageNum}?dpi=${dpi}`;
    const resp = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_values: fieldValues }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: `PDF service error: ${resp.status} - ${errText}` },
        { status: resp.status },
      );
    }

    const pngBuffer = Buffer.from(await resp.arrayBuffer());

    return new NextResponse(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        // No caching for live preview — values change constantly
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[render-filled-page] PDF service unreachable:', err);
    return NextResponse.json(
      { error: 'PDF service unavailable. Ensure the Docker PDF service is running (docker compose up pdf-service).' },
      { status: 502 },
    );
  }
}
