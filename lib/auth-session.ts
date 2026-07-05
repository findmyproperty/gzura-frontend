import type { User } from '@/lib/api';

const TOKEN_KEY = 'gzura_token';
const USER_CACHE_KEY = 'gzura_user_cache';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

function readCookieToken(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(?:^|;\s*)gzura_token=([^;]*)/);
  if (!match?.[1]) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  const fromStorage = localStorage.getItem(TOKEN_KEY);
  if (fromStorage) return fromStorage;

  const fromCookie = readCookieToken();
  if (fromCookie) {
    localStorage.setItem(TOKEN_KEY, fromCookie);
    return fromCookie;
  }

  return null;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getCachedUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function cacheUser(user: User) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

export function clearCachedUser() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(USER_CACHE_KEY);
}

