'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { EventRegistration } from '@/lib/api';
import { getCompletionBadge } from '@/lib/learning-status';
import { cn } from '@/lib/utils';

function EventCardImage({
  imageUrl,
  title,
  compact = false,
}: {
  imageUrl?: string | null;
  title: string;
  compact?: boolean;
}) {
  if (!imageUrl) {
    return (
      <div
        className={cn(
          'bg-purple-50 flex items-center justify-center shrink-0',
          compact ? 'w-28 h-[72px] rounded' : 'w-full aspect-[16/10]',
        )}
      >
        <Calendar className={cn('text-purple-deep', compact ? 'w-6 h-6' : 'w-10 h-10')} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden bg-gray-100 shrink-0',
        compact ? 'w-28 h-[72px] rounded' : 'w-full aspect-[16/10]',
      )}
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

function CompletionBadge({ reg }: { reg: EventRegistration }) {
  const badge = getCompletionBadge(reg);
  if (!badge) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        badge === 'attended'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-600',
      )}
    >
      {badge === 'attended' ? 'Attended' : 'Not attended'}
    </span>
  );
}

export function LearningEventCard({ reg }: { reg: EventRegistration }) {
  const event = reg.event;
  if (!event) return null;

  return (
    <Link
      href={`/home/events/${reg.eventId}`}
      className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
    >
      <EventCardImage imageUrl={event.imageUrl} title={event.title} compact />
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-xs text-gray-500">{event.type}</p>
          <CompletionBadge reg={reg} />
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-deep transition-colors">
          {event.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.dateStart).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.location}
          </span>
        </div>
        <p className="text-sm text-purple-deep font-medium mt-2 flex items-center gap-1">
          View event <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </Link>
  );
}

export function CertificateCard({ reg }: { reg: EventRegistration }) {
  const event = reg.event;
  if (!event) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <EventCardImage imageUrl={event.imageUrl} title={event.title} compact />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gold-royal mb-1">{reg.certificateNumber}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Issued{' '}
          {reg.certificateIssuedAt
            ? new Date(reg.certificateIssuedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <Link
          href={`/my-learnings/certificates/${reg.id}`}
          className="inline-flex items-center justify-center rounded-full border border-purple-deep px-4 py-2 text-sm font-medium text-purple-deep hover:bg-purple-50 transition-colors"
        >
          View certificate
        </Link>
      </div>
    </div>
  );
}
