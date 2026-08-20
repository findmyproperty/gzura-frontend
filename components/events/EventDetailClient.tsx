'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventDetailSkeleton from '@/components/events/EventDetailSkeleton';
import EventDetailView from '@/components/events/EventDetailView';
import { api, Event } from '@/lib/api';

type EventDetailClientProps = {
  eventId: string;
  backHref: string;
  backLabel: string;
  shell: 'public' | 'member';
};

export default function EventDetailClient({
  eventId,
  backHref,
  backLabel,
  shell,
}: EventDetailClientProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    setLoading(true);
    setMissing(false);

    api
      .getEvent(eventId)
      .then((data) => {
        if (!cancelled) setEvent(data);
      })
      .catch(() => {
        if (!cancelled) {
          setEvent(null);
          setMissing(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    if (!event?.title) return;
    const previousTitle = document.title;
    document.title = `${event.title} | GZURA`;
    return () => {
      document.title = previousTitle;
    };
  }, [event?.title]);

  if (loading) {
    return <EventDetailSkeleton shell={shell} />;
  }

  if (missing || !event) {
    return (
      <section className="section-padding bg-white">
        <div className="container py-16 text-center">
          <h1 className="heading-md text-purple-deep">Event not found</h1>
          <p className="mt-2 text-gray-500">
            This event may have been removed or is no longer available.
          </p>
          <Link href={backHref} className="mt-6 inline-block">
            <Button className="btn-primary">{backLabel}</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <EventDetailView
      event={event}
      backHref={backHref}
      backLabel={backLabel}
      shell={shell}
    />
  );
}
