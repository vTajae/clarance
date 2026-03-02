// ---------------------------------------------------------------------------
// NextAuth v5 — edge-compatible base config (no Node.js dependencies)
// ---------------------------------------------------------------------------
// This file is imported by middleware (edge runtime). It must NOT import
// bcryptjs, pg, or any other Node.js-only module.

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const PUBLIC_PATHS = [
        '/login',
        '/register',
        '/api/auth',
        '/import',
        '/new',
        '/verify',
      ];

      const isPublic =
        pathname === '/' ||
        PUBLIC_PATHS.some((p) => pathname.startsWith(p));

      if (isPublic) return true;
      if (isLoggedIn) return true;

      // Redirect to login
      return false;
    },
  },

  providers: [], // Providers are added in the full auth.ts config
} satisfies NextAuthConfig;
