import { EventRegistration } from '@/lib/api';

function getEventDates(reg: EventRegistration) {
  return reg.event;
}

export function isEventEnded(reg: EventRegistration) {
  const event = getEventDates(reg);
  if (!event) return false;
  const end = event.dateEnd ?? event.dateStart;
  if (!end) return false;
  return new Date(end) < new Date();
}

export function hasAttended(reg: EventRegistration) {
  const event = reg.event;
  if (!event) return false;
  if (event.type === 'Offline') {
    return Boolean(reg.checkedInAt);
  }
  return Boolean(reg.attendedAt);
}

export function getLearningBucket(
  reg: EventRegistration,
): 'in-progress' | 'completed' {
  return isEventEnded(reg) ? 'completed' : 'in-progress';
}

export function getCompletionBadge(
  reg: EventRegistration,
): 'attended' | 'not-attended' | null {
  if (!isEventEnded(reg)) return null;
  return hasAttended(reg) ? 'attended' : 'not-attended';
}

export function hasCertificate(reg: EventRegistration) {
  return Boolean(reg.certificateIssuedAt && reg.certificateNumber);
}
