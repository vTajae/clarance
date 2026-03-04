import { NextResponse } from 'next/server';

/**
 * PDF export is now handled client-side using pdf-lib.
 * This server route is kept as a stub for backwards compatibility.
 * The client-side useExportPdf() hook handles everything directly.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'PDF export has moved client-side. Use the Export button in the UI.' },
    { status: 410 },
  );
}
