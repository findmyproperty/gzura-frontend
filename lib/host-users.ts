import { User } from '@/lib/api';

export function labelForHost(host: Pick<User, 'firstName' | 'lastName' | 'email'>) {
  const name = `${host.firstName} ${host.lastName}`.trim();
  return name || host.email;
}

export function hostOptionLabel(host: User) {
  const name = labelForHost(host);
  return name === host.email ? name : `${name} (${host.email})`;
}

export function bioForHost(host: Pick<User, 'profession' | 'city'>) {
  return [host.profession, host.city].filter(Boolean).join(' • ');
}