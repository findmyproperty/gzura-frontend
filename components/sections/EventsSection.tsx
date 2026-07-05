import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const events = [
  {
    title: 'Leadership Summit 2024',
    type: 'Conference',
    date: 'March 15-17, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Grand Convention Center',
    image: 'https://images.pexels.com/photos/1540589/pexels-photo-1540589.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    title: 'Entrepreneurship Workshop',
    type: 'Workshop',
    date: 'March 22, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'Innovation Hub',
    image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    title: 'Women in Business Mixer',
    type: 'Networking',
    date: 'March 28, 2024',
    time: '6:00 PM - 9:00 PM',
    location: 'Skyline Rooftop Lounge',
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    title: 'Mentorship Match Day',
    type: 'Community',
    date: 'April 5, 2024',
    time: '2:00 PM - 5:00 PM',
    location: 'GZURA Community Center',
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

export default function EventsSection() {
  return (
    <section className="section-padding gradient-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span className="text-gold-400 text-sm font-semibold">
              Upcoming Events
            </span>
          </div>

          <h2 className="heading-lg text-white mb-6">
            Connect, Learn &{' '}
            <span className="text-gold-400">Grow Together</span>
          </h2>

          <p className="text-white/80 text-lg">
            Join our events to network with like-minded individuals, learn from
            industry experts, and accelerate your growth journey.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Event */}
          <div className="lg:row-span-2">
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <div className="absolute inset-0">
                <img
                  src={events[0].image}
                  alt={events[0].title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-deep via-purple-deep/70 to-transparent" />
              </div>

              <div className="relative h-full p-8 flex flex-col justify-end min-h-[400px]">
                <div className="inline-flex items-center gap-2 bg-gold-500 text-purple-950 rounded-full px-3 py-1 text-xs font-bold mb-4 w-fit">
                  FEATURED EVENT
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {events[0].title}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{events[0].date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{events[0].time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{events[0].location}</span>
                  </div>
                </div>

                <Link href="/events">
                  <button className="btn-secondary">Register Now</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Other Events */}
          {events.slice(1).map((event) => (
            <div
              key={event.title}
              className="glass-dark rounded-2xl p-6 flex gap-6 group hover:bg-purple-800/30 transition-colors"
            >
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1">
                <span className="text-gold-400 text-xs font-semibold">
                  {event.type.toUpperCase()}
                </span>
                <h3 className="text-lg font-semibold text-white mt-1 mb-2">
                  {event.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white font-semibold group"
          >
            View All Events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
