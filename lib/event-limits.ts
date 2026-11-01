import { assertValidTimeLabel } from '@/lib/time-range';

/** Defaults until client confirms (docs/GZURA-Client-Questions.md). */
export const MAX_EVENT_ATTENDEES = 500;
export const MAX_EVENT_PRICE = 100_000;

export function todayDateInputValue(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isPastDateInput(date: string): boolean {
  if (!date) return false;
  return date < todayDateInputValue();
}

/** Returns an error message, or null if valid. */
export function validateEventLimits(input: {
  dateStart: string;
  timeLabel?: string;
  price: number;
  maxAttendees?: number | null;
}): string | null {
  if (isPastDateInput(input.dateStart)) {
    return 'Event date cannot be in the past';
  }
  if (!Number.isFinite(input.price) || input.price < 0) {
    return 'Price must be zero or greater';
  }
  if (input.price > MAX_EVENT_PRICE) {
    return `Price cannot exceed ₹${MAX_EVENT_PRICE.toLocaleString('en-IN')}`;
  }
  if (
    input.maxAttendees != null &&
    (!Number.isFinite(input.maxAttendees) ||
      input.maxAttendees < 1 ||
      input.maxAttendees > MAX_EVENT_ATTENDEES)
  ) {
    return `Max attendees must be between 1 and ${MAX_EVENT_ATTENDEES}`;
  }
  const timeError = assertValidTimeLabel(input.timeLabel ?? '');
  if (timeError) return timeError;
  return null;
}
