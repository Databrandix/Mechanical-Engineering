import { NextResponse, type NextRequest } from 'next/server';

// Cheap edge-runtime cookie-presence check for /admin/* routes.
// Full session validation happens inside the (authed) layout via
// auth.api.getSession (Prisma → Node-only, can't run on Edge).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must be reachable without a session.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // /admin/logout has its own route handler that revokes + clears
  // the cookie; let it through too.
  if (pathname === '/admin/logout') {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('better-auth.session_token');
  if (!sessionCookie) {
    const url = new URL('/admin/login', request.url);
    if (pathname !== '/admin') {
      url.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
