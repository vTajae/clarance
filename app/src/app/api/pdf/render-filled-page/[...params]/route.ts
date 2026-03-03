import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

/**
 * Proxy endpoint for live PDF preview rendering.
 * POSTs field values to the Python PDF service which fills them in-memory
 * and renders the specified page as PNG.
 *
 * URL pattern: POST /api/pdf/render-filled-page/{version}/{pageNumber}?dpi=72
 * Body:        { "field_values": { "fieldName": "value", ... } }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  const session = await auth();
  // TODO: Remove dev bypass once auth is re-enabled
  if (false && !session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

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

  const url = new URL(request.url);
  const dpi = url.searchParams.get('dpi') || '72';

  let body: { field_values?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      `${PDF_SERVICE_URL}/render-filled-page/${encodeURIComponent(version)}/${pageNum}?dpi=${encodeURIComponent(dpi)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_values: body.field_values ?? {} }),
      },
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: `PDF service error: ${text}` },
        { status: upstream.status },
      );
    }

    const pngBuffer = await upstream.arrayBuffer();

    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store',
      },
    });
  } catch (error) {
    console.error('PDF render-filled proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to reach PDF service' },
      { status: 502 },
    );
  }
}
