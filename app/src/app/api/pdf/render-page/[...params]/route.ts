import { NextRequest, NextResponse } from 'next/server';

/**
 * PDF page rendering — serves pre-rendered static PNGs.
 *
 * URL pattern: /api/pdf/render-page/{version}/{pageNumber}
 * Example:     /api/pdf/render-page/sf861/0
 *
 * Pages are pre-rendered from the PDF template and stored as static assets
 * in /public/pdf-pages/{version}/page-{pageNumber}.png.
 * If static PNGs aren't available yet, returns 404.
 */
export async function GET(
  request: NextRequest,
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

  // Redirect to the static asset — Next.js serves files from /public
  const staticPath = `/pdf-pages/${encodeURIComponent(version)}/page-${pageNum}.png`;

  return NextResponse.redirect(new URL(staticPath, request.url), {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
