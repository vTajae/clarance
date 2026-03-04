import { NextRequest, NextResponse } from 'next/server';

/**
 * Live PDF preview is not available in the Cloudflare Workers deployment.
 * The coordinate overlay uses static pre-rendered page backgrounds instead.
 *
 * This route returns the static (unfilled) page image as a fallback.
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

  // Fall back to the static page image
  const staticPath = `/pdf-pages/${encodeURIComponent(version)}/page-${pageNum}.png`;

  return NextResponse.redirect(new URL(staticPath, request.url), {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
