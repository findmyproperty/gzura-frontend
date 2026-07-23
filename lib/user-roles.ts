export type UserRole = 'MEMBER' | 'HOST' | 'ADMIN';

export const USER_ROLE_OPTIONS = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'HOST', label: 'Instructor' },
  { value: 'ADMIN', label: 'Administrator' },
] as const satisfies ReadonlyArray<{ value: UserRole; label: string }>;

export function formatUserRole(role: UserRole): string {
  return USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

/** Learner / member dashboard roles */
export function isMemberAreaRole(role: UserRole): boolean {
  return role === 'MEMBER';
}

/** Admin panel access (full admin or instructor) */
export function isAdminAreaRole(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'HOST';
}

/** Can create/manage events in the admin panel */
export function canManageEvents(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'HOST';
}

/** Full admin-only sections (users, host requests, stats APIs, etc.) */
export function isFullAdmin(role: UserRole): boolean {
  return role === 'ADMIN';
}
