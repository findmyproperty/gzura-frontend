export type UserRole = 'MEMBER' | 'HOST' | 'ADMIN';

export const USER_ROLE_OPTIONS = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'HOST', label: 'Host' },
  { value: 'ADMIN', label: 'Administrator' },
] as const satisfies ReadonlyArray<{ value: UserRole; label: string }>;

export function formatUserRole(role: UserRole): string {
  return USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

export function isMemberAreaRole(role: UserRole): boolean {
  return role === 'MEMBER' || role === 'HOST';
}
