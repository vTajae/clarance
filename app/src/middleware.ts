// ---------------------------------------------------------------------------
// Edge-compatible middleware — uses the lightweight auth config (no bcrypt/pg)
// ---------------------------------------------------------------------------

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
