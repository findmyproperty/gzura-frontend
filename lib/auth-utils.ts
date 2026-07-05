import type { UserRole } from '@/lib/user-roles';

export type { UserRole } from '@/lib/user-roles';
export { formatUserRole, isMemberAreaRole, USER_ROLE_OPTIONS } from '@/lib/user-roles';

export function getDashboardPath(role: UserRole): string {
  return role === 'ADMIN' ? '/admin' : '/home';
}

export function resolvePostLoginRedirect(
  role: UserRole,
  redirect?: string | null,
): string {
  if (!redirect || redirect === '/' || redirect.startsWith('/home')) {
    return getDashboardPath(role);
  }

  if (redirect.startsWith('/admin') && role !== 'ADMIN') {
    return '/home';
  }

  if (
    (redirect.startsWith('/my-learnings') || redirect.startsWith('/dashboard')) &&
    role === 'ADMIN'
  ) {
    return '/admin';
  }

  if (redirect.startsWith('/dashboard')) {
    return '/my-learnings';
  }

  return redirect;
}