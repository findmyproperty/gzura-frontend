import { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import PublicEventsList from '@/components/events/PublicEventsList';

export const metadata: Metadata = {
  title: 'Events | GZURA',
  description:
    'Join GZURA events to network, learn, and grow with our community of leaders and entrepreneurs.',
};

export default function EventsPage() {
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
          <PublicEventsList />
        </div>
      </section>
    </>
  );
}
