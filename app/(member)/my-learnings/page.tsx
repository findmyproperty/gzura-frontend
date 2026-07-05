'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Award,
  Calendar,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, EventRegistration } from '@/lib/api';
import {
  getGoalLabel,
  getMemberPreferences,
  getProgramLabel,
} from '@/lib/member-onboarding';
import { cn } from '@/lib/utils';

type LearningTab = 'in-progress' | 'completed' | 'certificates';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function isEventCompleted(reg: EventRegistration) {
  const end = reg.event?.dateEnd ?? reg.event?.dateStart;
  if (!end) return false;
  return new Date(end) < new Date();
}

function EventCardImage({
  imageUrl,
  title,
  compact = false,
}: {
  imageUrl?: string | null;
  title: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <div
        className={cn(
          'bg-purple-50 flex items-center justify-center shrink-0',
          compact ? 'w-28 h-[72px] rounded' : 'w-full aspect-[16/10]',
        )}
      >
        <Calendar className={cn('text-purple-deep', compact ? 'w-6 h-6' : 'w-10 h-10')} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden bg-gray-100 shrink-0',
        compact ? 'w-28 h-[72px] rounded' : 'w-full aspect-[16/10]',
      )}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function LearningIllustration() {
  return (
    <div className="hidden lg:flex items-end justify-center w-72 xl:w-80 shrink-0" aria-hidden>
      <svg viewBox="0 0 320 240" className="w-full h-auto" fill="none">
        <rect x="40" y="120" width="120" height="80" rx="4" fill="#E8DFF5" />
        <rect x="52" y="132" width="36" height="28" rx="2" fill="#C9A227" opacity="0.7" />
        <rect x="96" y="132" width="52" height="52" rx="2" fill="#2D0A4E" opacity="0.15" />
        <polygon points="40,120 100,80 160,120" fill="#2D0A4E" opacity="0.25" />
        <rect x="180" y="100" width="100" height="100" rx="4" fill="#F5F0E0" />
        <rect x="192" y="112" width="76" height="12" rx="2" fill="#C9A227" opacity="0.5" />
        <rect x="192" y="132" width="76" height="56" rx="2" fill="#2D0A4E" opacity="0.1" />
        <circle cx="248" cy="60" r="28" fill="#C9A227" opacity="0.3" />
        <rect x="60" y="200" width="200" height="8" rx="4" fill="#E5E7EB" />
        <circle cx="90" cy="188" r="10" fill="#2D0A4E" opacity="0.4" />
        <circle cx="230" cy="188" r="10" fill="#C9A227" opacity="0.6" />
      </svg>
    </div>
  );
}

function CertificateIllustration() {
  return (
    <div className="mx-auto mb-6 w-48 h-36 flex items-center justify-center" aria-hidden>
      <div className="relative">
        <div className="w-32 h-24 bg-purple-100 rounded-lg border-2 border-purple-200 flex items-center justify-center">
          <Award className="w-12 h-12 text-gold-royal" />
        </div>
        <div className="absolute -bottom-2 -right-3 w-10 h-10 rounded-full bg-gold-royal/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold-royal" />
        </div>
      </div>
    </div>
  );
}

function EmptyLearningState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="py-16 px-4 text-center max-w-lg mx-auto">
      <CertificateIllustration />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>
      <Button asChild className="btn-primary rounded-full px-8">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

function EventListCard({ reg }: { reg: EventRegistration }) {
  const event = reg.event;
  if (!event) return null;

  return (
    <Link
      href={`/home/events/${reg.eventId}`}
      className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
    >
      <EventCardImage imageUrl={event.imageUrl} title={event.title} compact />
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-xs text-gray-500 mb-1">{event.type}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-deep transition-colors">
          {event.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.dateStart).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.location}
          </span>
        </div>
        <p className="text-sm text-purple-deep font-medium mt-2 flex items-center gap-1">
          View event <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const tabParam = searchParams.get('tab') as LearningTab | null;
  const activeTab: LearningTab =
    tabParam === 'completed' || tabParam === 'certificates' ? tabParam : 'in-progress';

  useEffect(() => {
    if (!user) return;
    api
      .getMyRegistrations()
      .then(setRegistrations)
      .finally(() => setDataLoading(false));
  }, [user]);

  const { inProgress, completed } = useMemo(() => {
    const inProg: EventRegistration[] = [];
    const done: EventRegistration[] = [];
    for (const reg of registrations) {
      if (isEventCompleted(reg)) done.push(reg);
      else inProg.push(reg);
    }
    return { inProgress: inProg, completed: done };
  }, [registrations]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
      </div>
    );
  }

  const preferences = getMemberPreferences(user);
  const goalLabel = getGoalLabel(preferences?.goal ?? '');
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
  const hasInterests = (preferences?.interests?.length ?? 0) > 0;

  const setTab = (tab: LearningTab) => {
    router.replace(`/my-learnings?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-purple-deep flex items-center justify-center shrink-0">
                  <span className="text-white text-2xl sm:text-3xl font-semibold">{initials}</span>
                </div>
                <div className="min-w-0 pt-1">
                  <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
                    {getTimeGreeting()}, {user.firstName}
                  </h1>
                  {goalLabel ? (
                    <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
                      Your goal is to{' '}
                      <span className="text-gray-900">{goalLabel.toLowerCase()}</span>.
                    </p>
                  ) : null}
                </div>
              </div>

              {hasInterests && preferences?.interests && (
                <div className="mt-4 flex flex-wrap gap-2 max-w-xl">
                  {preferences.interests.slice(0, 3).map((id) => (
                    <span
                      key={id}
                      className="text-xs font-medium bg-purple-50 text-purple-deep px-3 py-1 rounded-full"
                    >
                      {getProgramLabel(id)}
                    </span>
                  ))}
                  {preferences.interests.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{preferences.interests.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <LearningIllustration />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={(v) => setTab(v as LearningTab)}>
          <TabsList className="h-auto p-0 bg-transparent rounded-none border-b border-gray-200 w-full justify-start gap-0">
            <TabsTrigger
              value="in-progress"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 mr-8 text-base font-normal text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 mr-8 text-base font-normal text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 text-base font-normal text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-8 focus-visible:outline-none">
            {dataLoading ? (
              <div className="py-20 text-center text-gray-500">Loading your events...</div>
            ) : inProgress.length > 0 ? (
              <div className="space-y-3 max-w-3xl">
                {inProgress.map((reg) => (
                  <EventListCard key={reg.id} reg={reg} />
                ))}
              </div>
            ) : (
              <EmptyLearningState
                title="Your learning journey starts here!"
                description="Join a course from the GZURA catalog to build leadership skills, grow your business, and connect with our community."
                actionLabel="Browse courses"
                actionHref="/events"
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-8 focus-visible:outline-none">
            {dataLoading ? (
              <div className="py-20 text-center text-gray-500">Loading your events...</div>
            ) : completed.length > 0 ? (
              <div className="space-y-3 max-w-3xl">
                {completed.map((reg) => (
                  <EventListCard key={reg.id} reg={reg} />
                ))}
              </div>
            ) : (
              <EmptyLearningState
                title="No completed events yet"
                description="Events you attend will appear here once they are finished. Keep learning and growing with GZURA."
                actionLabel="Find events"
                actionHref="/events"
              />
            )}
          </TabsContent>

          <TabsContent value="certificates" className="mt-8 focus-visible:outline-none">
            <div className="max-w-3xl border border-gray-200 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Event attendance</h3>
                <p className="text-sm text-gray-600">
                  Complete registered events to earn certificates you can share with employers and
                  your network.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0 rounded-full border-purple-deep text-purple-deep hover:bg-purple-50">
                <Link href="/events">Browse events</Link>
              </Button>
            </div>

            <EmptyLearningState
              title="Your first certificate is waiting!"
              description="Your next career move starts with a certificate. Complete a GZURA event and earn a credential you can proudly share."
              actionLabel="Explore events"
              actionHref="/events"
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}