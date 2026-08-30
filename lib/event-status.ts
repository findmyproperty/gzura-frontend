import type { Event } from '@/lib/api';

export type EventCardBadge = 'full' | 'expired';

type EventStatusSource = Pick<
  Event,
  'dateStart' | 'dateEnd' | 'maxAttendees' | '_count'
>;

export function isEventExpired(
  event: Pick<Event, 'dateStart' | 'dateEnd'>,
  now = Date.now(),
) {
  const end = event.dateEnd || event.dateStart;
  const timestamp = new Date(end).getTime();
  if (Number.isNaN(timestamp)) return false;
  return now > timestamp;
}

export function isEventFull(event: Pick<Event, 'maxAttendees' | '_count'>) {
  if (event.maxAttendees == null || event.maxAttendees <= 0) return false;
  return (event._count?.registrations ?? 0) >= event.maxAttendees;
}

export function getEventCardBadge(event: EventStatusSource): EventCardBadge | null {
  if (isEventExpired(event)) return 'expired';
  if (isEventFull(event)) return 'full';
  return null;
}

export function eventCardBadgeLabel(badge: EventCardBadge) {
  return badge === 'expired' ? 'Expired' : 'Full';
}
