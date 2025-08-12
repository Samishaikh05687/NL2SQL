import { auth } from './auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }
  return null;
});

export const config = {
  matcher: ['/dashboard/:path*'],
};