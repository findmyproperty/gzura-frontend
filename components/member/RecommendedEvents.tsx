'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Event } from '@/lib/api';
import { getRecommendedEvents } from '@/lib/event-recommendations';
import { getGoalLabel, getMemberPreferences } from '@/lib/member-onboarding';

export default function RecommendedEvents({ events }: { events: Event[] }) {
  const { user } = useAuth();
  const preferences = getMemberPreferences(user);
  const recommended = getRecommendedEvents(events, preferences, 6);
  const goalLabel = preferences ? getGoalLabel(preferences.goal) : null;

  if (recommended.length === 0) return null;

  return (
    <section className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recommended for you
          </h2>
          {goalLabel ? (
            <p className="mt-1 text-sm text-gray-600">
              Based on your goal to {goalLabel.toLowerCase()}
              {preferences?.interests?.length
                ? ` and ${preferences.interests.length} selected program${
                    preferences.interests.length === 1 ? '' : 's'
                  }`
                : ''}
            </p>
          ) : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((event) => (
            <Link
              key={event.id}
              href={`/home/events/${event.id}`}
              className="group flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{event.type}</p>
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-purple-deep">
                  {event.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-purple-deep">
                  View event <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}