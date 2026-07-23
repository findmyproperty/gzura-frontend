import type { UserRole } from '@/lib/user-roles';
import {
  canManageEvents,
  isAdminAreaRole,
  isFullAdmin,
} from '@/lib/user-roles';

export type { UserRole } from '@/lib/user-roles';
export {
  canManageEvents,
  formatUserRole,
  isAdminAreaRole,
  isFullAdmin,
  isMemberAreaRole,
  USER_ROLE_OPTIONS,
} from '@/lib/user-roles';

export function getDashboardPath(role: UserRole): string {
  return isAdminAreaRole(role) ? '/admin' : '/home';
}

/** Paths instructors (HOST) may use inside /admin */
export function isInstructorAdminPath(pathname: string): boolean {
  if (pathname === '/admin' || pathname === '/admin/') return true;
  return (
    pathname === '/admin/events' ||
    pathname.startsWith('/admin/events/')
  );
}

export function resolvePostLoginRedirect(
  role: UserRole,
  redirect?: string | null,
): string {
  if (!redirect || redirect === '/' || redirect.startsWith('/home')) {
    return getDashboardPath(role);
  }

  if (redirect.startsWith('/admin')) {
    if (isFullAdmin(role)) return redirect;
    if (canManageEvents(role) && isInstructorAdminPath(redirect)) return redirect;
    return getDashboardPath(role);
  }

  if (
    (redirect.startsWith('/my-learnings') || redirect.startsWith('/dashboard')) &&
    isAdminAreaRole(role)
  ) {
    return getDashboardPath(role);
  }

  if (redirect.startsWith('/dashboard')) {
    return '/my-learnings';
  }

  return redirect;
}