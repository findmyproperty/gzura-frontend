'use client';

import { useEffect, useState } from 'react';
import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, Event } from '@/lib/api';

const colors = [
  'from-purple-800 to-purple-950',
  'from-gold-royal to-gold-400',
  'from-purple-700 to-purple-900',
];

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.getEvents().then((data) => setEvents(data.slice(0, 3))).catch(() => {});
  }, []);
  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden" aria-labelledby="events-heading">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <ScrollAnimate animation="fade-up">
          <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-purple-700" aria-hidden="true" />
              <span className="text-purple-700 text-sm font-semibold">
                Upcoming Events
              </span>
            </div>

            <h2 id="events-heading" className="heading-lg text-gray-900 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h2>

            <p className="text-gray-600 text-lg md:text-xl">
              Learn, connect, and grow with GZURA&apos;s exclusive events.
            </p>
          </header>
        </ScrollAnimate>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Loading events...</p>
          ) : events.map((event, index) => {
            const color = colors[index % colors.length];
            return (
            <ScrollAnimate key={event.id} animation="fade-up" delay={index * 150}>
              <article className="group bg-white rounded-2xl shadow-lg shadow-purple-500/5 border border-gray-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
                <div className={`h-2 bg-gradient-to-r ${color}`} aria-hidden="true" />
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm md:text-base font-medium">{new Date(event.dateStart).toLocaleDateString()}</span>
                    </div>
                    {event.timeLabel && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm md:text-base">{event.timeLabel}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm md:text-base">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 flex-1 line-clamp-3">
                    {event.description}
                  </p>
                  <Link href={`/events/${event.id}/register`}>
                    <Button className={`w-full bg-gradient-to-r ${color} hover:opacity-90 text-white font-semibold py-3`}>
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </article>
            </ScrollAnimate>
          );})}
        </div>

        {/* View All Events CTA */}
        <ScrollAnimate animation="fade-up" delay={450}>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/events">
              <button className="btn-primary group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
