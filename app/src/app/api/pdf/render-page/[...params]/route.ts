import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

/**
 * Proxy endpoint for PDF page rendering.
 * Forwards requests to the Python PDF service which renders pages as PNG.
 *
 * URL pattern: /api/pdf/render-page/{version}/{pageNumber}?dpi=150
 * Example:     /api/pdf/render-page/sf861/0?dpi=150
 */
export async function GET(
  _request: NextRequest,
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

  const url = new URL(_request.url);
  const dpi = url.searchParams.get('dpi') || '150';

  try {
    const upstream = await fetch(
      `${PDF_SERVICE_URL}/render-page/${encodeURIComponent(version)}/${pageNum}?dpi=${encodeURIComponent(dpi)}`,
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
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('PDF render proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to reach PDF service' },
      { status: 502 },
    );
  }
}
