import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isAdminPath,
  isAuthPath,
  isMemberPath,
} from '@/lib/routes';

type JwtPayload = {
  role?: string;
};

function isMemberAreaRole(role?: string) {
  return role === 'MEMBER';
}

function isAdminAreaRole(role?: string) {
  return role === 'ADMIN' || role === 'HOST';
}

/** Instructors may only use event routes under /admin */
function isInstructorAdminPath(pathname: string) {
  if (pathname === '/admin' || pathname === '/admin/') return true;
  return (
    pathname === '/admin/events' ||
    pathname.startsWith('/admin/events/')
  );
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('redirect', pathname);
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gzura_token')?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role;

  if (pathname === '/' && token) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminAreaRole(role) ? '/admin' : '/home';
    return NextResponse.redirect(url);
  }

  if (pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname)) {
    if (token && isAdminAreaRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    if (token && isMemberAreaRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAdminPath(pathname)) {
    if (!token) {
      return redirectToLogin(request, pathname);
    }
    if (role === 'ADMIN') {
      return NextResponse.next();
    }
    if (role === 'HOST') {
      if (!isInstructorAdminPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/events';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = isMemberAreaRole(role) ? '/home' : '/';
    return NextResponse.redirect(url);
  }

  if (isMemberPath(pathname)) {
    if (!token) {
      return redirectToLogin(request, pathname);
    }
    if (isAdminAreaRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const publicEventDetail = pathname.match(/^\/events\/([^/]+)$/);
  if (publicEventDetail && token && isMemberAreaRole(role)) {
    const url = request.nextUrl.clone();
    url.pathname = `/home/events/${publicEventDetail[1]}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/home',
    '/home/:path*',
    '/my-learnings/:path*',
    '/dashboard/:path*',
    '/onboarding',
    '/events/:id',
    '/events/:id/meet',
    '/admin/:path*',
    '/admin/login',
  ],
};
