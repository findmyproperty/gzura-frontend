'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  Pencil,
  User,
  Users,
  Video,
} from 'lucide-react';
import { AdminDetailLayout } from '@/components/admin/AdminDetailLayout';
import { formatAdminDate, PillBadge, StatusBadge } from '@/components/admin/AdminDataTable';
import { GoogleMeetFields } from '@/components/admin/GoogleMeetFields';
import EventContentManager from '@/components/admin/EventContentManager';
import EventEnrolledUsers from '@/components/admin/EventEnrolledUsers';
import RichTextContent from '@/components/ui/rich-text-content';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, Event } from '@/lib/api';
import { getEventCoverImage } from '@/lib/event-images';
import { isGoogleMeetLink } from '@/lib/meeting';
import { formatEventPrice } from '@/lib/price';
import { cn } from '@/lib/utils';

function resolveMeetLink(event: Event) {
  if (isGoogleMeetLink(event.meetingUrl)) return event.meetingUrl!;
  if (isGoogleMeetLink(event.meetingRoomId)) return event.meetingRoomId!;
  return event.meetingUrl || event.meetingRoomId || null;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'purple',
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'purple' | 'gold' | 'emerald';
}) {
  const accentClass = {
    purple: 'bg-purple-50 text-purple-deep',
    gold: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }[accent];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            accentClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value ?? '—'}</span>
    </div>
  );
}

export default function AdminEventViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvent(id, true)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <AdminDetailLayout
        backHref="/admin/events"
        backLabel="Back to events"
        title="Event not found"
      >
        <p className="text-gray-500">This event may have been removed.</p>
      </AdminDetailLayout>
    );
  }

  const coverImage = getEventCoverImage(event);
  const meetLink = resolveMeetLink(event);
  const enrolledCount = event._count?.registrations ?? 0;
  const isOnline = event.type === 'Online';

  return (
    <AdminDetailLayout
      backHref="/admin/events"
      backLabel="Back to events"
      title={event.title}
      subtitle={event.location}
      actions={
        <div className="flex flex-wrap gap-2">
          {isOnline && meetLink ? (
            <Button asChild variant="outline">
              <a href={meetLink} target="_blank" rel="noreferrer">
                <Video className="w-4 h-4 mr-2" />
                Open Google Meet
              </a>
            </Button>
          ) : null}
          <Button asChild className="btn-primary">
            <Link href={`/admin/events?edit=${event.id}`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit event
            </Link>
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
          {coverImage ? (
            <div className="relative h-48 lg:h-auto lg:min-h-[220px]">
              <img
                src={coverImage}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/30 to-transparent lg:bg-gradient-to-r" />
            </div>
          ) : (
            <div className="flex h-48 lg:h-auto lg:min-h-[220px] items-center justify-center bg-gradient-to-br from-purple-deep to-purple-900">
              <Calendar className="h-16 w-16 text-white/20" />
            </div>
          )}

          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <PillBadge className="bg-purple-50 text-purple-deep">
                {event.type}
              </PillBadge>
              <StatusBadge
                label={event.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                tone={event.status === 'PUBLISHED' ? 'success' : 'muted'}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-gold-royal" />
                <span>{formatAdminDate(event.dateStart)}</span>
              </div>
              {event.timeLabel ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-gold-royal" />
                  <span>{event.timeLabel}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 sm:col-span-1">
                <MapPin className="h-4 w-4 shrink-0 text-gold-royal" />
                <span className="truncate">{event.venue || event.location}</span>
              </div>
            </div>

            {event.speakerName ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-purple-deep" />
                <span>
                  <span className="font-medium">{event.speakerName}</span>
                  {event.speakerBio ? (
                    <span className="text-gray-500"> — {event.speakerBio}</span>
                  ) : null}
                </span>
              </div>
            ) : null}

            {event.description ? (
              <div className="mt-4 line-clamp-3 text-sm text-gray-600">
                <RichTextContent html={event.description} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Enrolled"
          value={enrolledCount}
          icon={Users}
          accent="emerald"
        />
        <StatCard
          label="Capacity"
          value={
            event.maxAttendees
              ? `${enrolledCount}/${event.maxAttendees}`
              : 'Unlimited'
          }
          icon={Users}
        />
        <StatCard
          label="Price"
          value={formatEventPrice(event.price)}
          icon={IndianRupee}
          accent="gold"
        />
        <StatCard
          label={isOnline ? 'Seats left' : 'Format'}
          value={
            isOnline && event.seatsRemaining != null
              ? event.seatsRemaining
              : event.type
          }
          icon={isOnline ? Video : MapPin}
        />
      </div>

      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-gray-100/80 p-1 flex-wrap">
          <TabsTrigger
            value="enrolled"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Enrolled
            <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-deep">
              {enrolledCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Event details
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Course content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="mt-0">
          <EventEnrolledUsers event={event} />
        </TabsContent>

        <TabsContent value="details" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Schedule & pricing
              </h3>
              <InfoRow label="Start date" value={formatAdminDate(event.dateStart)} />
              <InfoRow label="End date" value={formatAdminDate(event.dateEnd)} />
              <InfoRow label="Time" value={event.timeLabel} />
              <InfoRow label="Price" value={formatEventPrice(event.price)} />
              <InfoRow
                label="Member price"
                value={
                  event.memberPrice != null
                    ? formatEventPrice(event.memberPrice)
                    : '—'
                }
              />
              <InfoRow label="Max attendees" value={event.maxAttendees ?? '—'} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                {isOnline ? 'Online session' : 'Venue'}
              </h3>
              <InfoRow label="Location" value={event.location} />
              <InfoRow label="Venue" value={event.venue} />
              <InfoRow label="Speaker" value={event.speakerName} />

              {isOnline ? (
                <div className="mt-4">
                  <GoogleMeetFields
                    meetLink={meetLink}
                    totalSeats={event.maxAttendees}
                    seatsRemaining={event.seatsRemaining}
                  />
                </div>
              ) : null}

              {event.description ? (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-purple-deep mb-2">
                    Full description
                  </h4>
                  <RichTextContent
                    html={event.description}
                    className="text-sm text-gray-700"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-purple-deep">Course content</h3>
              <p className="text-sm text-gray-600 mt-1">
                Materials shared with enrolled students after they join.
              </p>
            </div>
            <EventContentManager eventId={event.id} />
          </div>
        </TabsContent>
      </Tabs>
    </AdminDetailLayout>
  );
}