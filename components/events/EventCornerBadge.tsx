import { cn } from '@/lib/utils';
import {
  EventCardBadge,
  eventCardBadgeLabel,
} from '@/lib/event-status';

const toneClass: Record<EventCardBadge, string> = {
  full: 'bg-gold-royal text-zinc-900',
  expired: 'bg-slate-700 text-white',
};

export function EventCornerBadge({ badge }: { badge: EventCardBadge | null }) {
  if (!badge) return null;

  const label = eventCardBadgeLabel(badge);

  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-10 h-16 w-16 overflow-hidden"
      aria-label={label}
    >
      <span
        className={cn(
          'absolute right-[-30px] top-[11px] w-[104px] rotate-45 py-[3px] text-center text-[9px] font-bold uppercase tracking-[0.16em] shadow-sm',
          toneClass[badge],
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function EventStatusPill({ badge }: { badge: EventCardBadge | null }) {
  if (!badge) return null;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        toneClass[badge],
      )}
    >
      {eventCardBadgeLabel(badge)}
    </span>
  );
}
