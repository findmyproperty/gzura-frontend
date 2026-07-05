import Link from 'next/link';
import { Calendar, ChevronRight, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import RecommendedEvents from '@/components/member/RecommendedEvents';
import { Button } from '@/components/ui/button';
import { Event } from '@/lib/api';

function formatPrice(price: string | number) {
  const n = Number(price);
  return n === 0 ? 'Free' : `$${n}`;
}

export default function MemberCoursesHome({ events }: { events: Event[] }) {
  const trending = events.slice(0, 8);

  return (
    <div className="bg-white">
      <section className="relative bg-purple-deep overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-gold-royal/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-purple-500/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-lg z-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Build in-demand skills
              </h1>
              <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                Get access to GZURA events and programs from real-world experts — leadership,
                entrepreneurship, and community growth.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button asChild className="btn-primary rounded-sm px-6">
                  <Link href="/events">Browse courses</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-sm px-6 border-purple-deep text-purple-deep hover:bg-purple-50"
                >
                  <Link href="/my-learnings">My Learnings</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative w-[420px] h-[280px] shrink-0">
              <div className="absolute -left-6 top-8 w-14 h-14 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-gold-400" />
              </div>
              <div className="absolute right-4 top-4 w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold-400" />
              </div>
              <img
                src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional learning"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending events</h2>
            {events.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">{events.length} published events</p>
            )}
          </div>
          {events.length > 8 && (
            <Link
              href="/events"
              className="text-sm font-semibold text-purple-deep hover:underline flex items-center gap-1"
            >
              Show all <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {trending.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-lg">
            <Calendar className="w-12 h-12 text-purple-deep mx-auto mb-4 opacity-50" />
            <p className="text-gray-600">No events available right now. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {trending.map((event) => (
              <Link
                key={event.id}
                href={`/home/events/${event.id}`}
                className="group"
              >
                <article className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-50">
                        <Calendar className="w-10 h-10 text-purple-deep opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.speakerName}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-amber-600">4.8</span>
                      <span className="text-gray-300">|</span>
                      <span>{event._count?.registrations ?? 0} enrolled</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {event.location}
                    </div>
                    <p className="mt-auto pt-3 font-bold text-sm text-gray-900">
                      {formatPrice(event.price)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <RecommendedEvents events={events} />
    </div>
  );
}