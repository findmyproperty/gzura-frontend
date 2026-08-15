import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/lib/events-server';
import { getEventCoverImage } from '@/lib/event-images';
import { formatEventPrice } from '@/lib/price';
import { richTextExcerpt } from '@/lib/rich-text';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events | GZURA',
  description:
    'Join GZURA events to network, learn, and grow with our community of leaders and entrepreneurs.',
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <section className="gradient-bg p-5 md:p-20 relative overflow-hidden">
        <div className="container relative z-10 px-0">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">Upcoming Events</span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Learn, Network & <span className="text-gold-400">Grow</span>
            </h1>
            <p className="text-lg text-white/80">
              Discover transformative events designed for leaders and entrepreneurs.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for new events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const coverImage = getEventCoverImage(event);

                return (
                  <article
                    key={event.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-purple-500/5 card-hover"
                  >
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-purple-50 via-white to-gold-50">
                      {coverImage ? (
                      <img
                        src={coverImage}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      ) : (
                        <div
                          className="flex h-full items-center justify-center"
                          aria-hidden="true"
                        >
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
          )}
        </div>
      </section>
    </>
  );
}
