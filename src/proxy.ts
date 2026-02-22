import { auth } from './auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/auth/login') {
    return Response.redirect(new URL('/auth/login', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|unauthorized).*)',
  ],
};
