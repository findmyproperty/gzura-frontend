'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventsListSkeleton from '@/components/events/EventsListSkeleton';
import { api, Event } from '@/lib/api';
import { getEventCoverImage } from '@/lib/event-images';
import { formatEventPrice } from '@/lib/price';
import { richTextExcerpt } from '@/lib/rich-text';

export default function PublicEventsList() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .getEvents()
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (events === null) {
    return <EventsListSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500">No upcoming events at the moment.</p>
        <p className="mt-2 text-sm text-gray-400">Check back soon for new events.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const coverImage = getEventCoverImage(event);

        return (
          <article
            key={event.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-purple-500/5 card-hover"
          >
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-50 via-white to-gold-50">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center" aria-hidden="true">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                    <Calendar className="h-8 w-8 text-purple-300" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div>
                <span className="rounded-full bg-gold-50 px-2 py-1 text-xs font-semibold text-gold-royal">
                  {event.type}
                </span>
                <h2 className="mt-3 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 text-purple-deep">
                  {event.title}
                </h2>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-600">
                  {richTextExcerpt(event.description, 120) ||
                    'More event details will be available soon.'}
                </p>
              </div>
              <div className="mt-4 min-h-[4.75rem] space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-purple-deep" />
                  {new Date(event.dateStart).toLocaleDateString()}
                </p>
                {event.timeLabel ? (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-purple-deep" />
                    {event.timeLabel}
                  </p>
                ) : null}
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-deep" />
                  <span className="line-clamp-1">{event.location}</span>
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                <span className="font-bold text-purple-deep">
                  {formatEventPrice(event.price)}
                </span>
                <Link href={`/events/${event.id}`}>
                  <Button size="sm" className="btn-primary">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
