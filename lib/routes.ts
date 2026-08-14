export const PUBLIC_PATHS = [
  '/',
  '/about',
  '/programs',
  '/events',
  '/blog',
  '/contact',
  '/success-stories',
  '/join',
  '/register',
  '/privacy',
  '/terms',
  '/cookies',
  '/faq',
  '/careers',
  '/press',
] as const;

export const AUTH_PATHS = ['/login', '/signup', '/forgot-password'] as const;

export const MEMBER_PATH_PREFIXES = [
  '/home',
  '/my-learnings',
  '/dashboard',
  '/onboarding',
  '/profile',
] as const;

export const ADMIN_PATH_PREFIX = '/admin';

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname === path);
}

export function isMemberPath(pathname: string): boolean {
  return (
    MEMBER_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) || /\/events\/[^/]+\/meet$/.test(pathname)
  );
}

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === ADMIN_PATH_PREFIX ||
    pathname.startsWith(`${ADMIN_PATH_PREFIX}/`)
  );
}

export function isPublicMarketingPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATHS.some(
    (path) => path !== '/' && (pathname === path || pathname.startsWith(`${path}/`)),
  );
}