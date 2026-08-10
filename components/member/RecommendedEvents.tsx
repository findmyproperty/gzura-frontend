'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Event } from '@/lib/api';
import { getRecommendedEvents } from '@/lib/event-recommendations';
import { getGoalLabel, getMemberPreferences } from '@/lib/member-onboarding';
import { Button } from '@/components/ui/button';

export default function RecommendedEvents({ events }: { events: Event[] }) {
  const { user } = useAuth();
  const preferences = getMemberPreferences(user);
  // Show max 4 events
  const recommended = getRecommendedEvents(events, preferences, 4);
  const goalLabel = preferences ? getGoalLabel(preferences.goal) : null;

  if (recommended.length === 0) return null;

  return (
    <section className="border-t border-slate-200/80 bg-slate-100/50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended for You
            </h2>
            {goalLabel ? (
              <p className="mt-1 text-sm text-slate-600">
                Curated based on your goal to <span className="font-semibold text-purple-900">{goalLabel.toLowerCase()}</span>
                {preferences?.interests?.length
                  ? ` and ${preferences.interests.length} selected focus area${
                      preferences.interests.length === 1 ? '' : 's'
                    }`
                  : ''}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Hand-picked sessions matching your profile and interests.
              </p>
            )}
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-800 hover:text-purple-950 transition-colors bg-white hover:bg-purple-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
          >
            <span>Show More</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((event) => (
            <Link
              key={event.id}
              href={`/home/events/${event.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:-translate-y-0.5"
            >
              <div>
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 relative mb-3">
                  <img
                    src={
                      event.imageUrl ||
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/50">
                      {event.type || 'Masterclass'}
                    </span>
                  </div>
                </div>
                <h3 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-purple-800 leading-snug">
                  {event.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="flex items-center gap-1 text-xs font-bold text-purple-900 group-hover:text-purple-700">
                  <span>Explore program</span> <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            className="bg-white hover:bg-purple-50 text-purple-900 font-bold border-purple-200 rounded-xl px-8 py-2.5 shadow-sm"
          >
            <Link href="/events" className="inline-flex items-center gap-2">
              <span>Show More Recommended Events</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}