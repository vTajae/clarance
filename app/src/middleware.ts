import { NextResponse } from 'next/server';

// Auth removed — app is public, UUID-based.
// Middleware is kept as a no-op to preserve the matcher (static asset exclusion).
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
