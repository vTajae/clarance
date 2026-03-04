import { NextResponse } from 'next/server';

/**
 * PDF import is now handled client-side using pdf-lib.
 * This server route is kept as a stub for backwards compatibility.
 * The import page handles extraction directly in the browser.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'PDF import has moved client-side. Use the Import page in the UI.' },
    { status: 410 },
  );
}
