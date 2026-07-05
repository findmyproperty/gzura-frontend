import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/lib/events-server';
import { richTextExcerpt } from '@/lib/rich-text';

export const metadata: Metadata = {
  title: 'Events | GZURA',
  description:
    'Join GZURA events to network, learn, and grow with our community of leaders and entrepreneurs.',
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <section className="gradient-bg pt-32 pb-20 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
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
        <div className="container-custom">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for new events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-gray-100 card-hover group"
                >
                  {event.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-semibold text-gold-royal bg-gold-50 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                    <h2 className="text-xl font-semibold text-purple-deep mt-3 mb-2">{event.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {richTextExcerpt(event.description, 120)}
                    </p>
                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-deep" />
                        {new Date(event.dateStart).toLocaleDateString()}
                      </p>
                      {event.timeLabel && (
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-deep" />
                          {event.timeLabel}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-deep" />
                        {event.location}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-deep">
                        {Number(event.price) === 0 ? 'Free' : `$${event.price}`}
                      </span>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" className="btn-primary">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}