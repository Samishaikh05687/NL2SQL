import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/auth/signin' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) return isLoggedIn ? true : Response.redirect(new URL('/auth/signin', nextUrl));
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;