'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Loader2, Pencil, Video } from 'lucide-react';
import {
  AdminDetailLayout,
  DetailCard,
  DetailField,
} from '@/components/admin/AdminDetailLayout';
import { formatAdminDate, PillBadge, StatusBadge } from '@/components/admin/AdminDataTable';
import { GoogleMeetFields } from '@/components/admin/GoogleMeetFields';
import EventContentManager from '@/components/admin/EventContentManager';
import RichTextContent from '@/components/ui/rich-text-content';
import { Button } from '@/components/ui/button';
import { api, Event } from '@/lib/api';

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

  return (
    <AdminDetailLayout
      backHref="/admin/events"
      backLabel="Back to events"
      title={event.title}
      subtitle={event.location}
      actions={
        <div className="flex flex-wrap gap-2">
          {event.type === 'Online' && (event.meetingUrl || event.meetingRoomId) ? (
            <Button asChild variant="outline">
              <a
                href={event.meetingUrl || event.meetingRoomId || '#'}
                target="_blank"
                rel="noreferrer"
              >
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
        <div className="space-y-6">
          <DetailCard>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <Calendar className="h-7 w-7 text-purple-deep" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PillBadge>{event.type}</PillBadge>
                <StatusBadge
                  label={event.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                  tone={event.status === 'PUBLISHED' ? 'success' : 'muted'}
                />
              </div>
            </div>
            <DetailField
              label="Description"
              value={
                event.description ? (
                  <RichTextContent html={event.description} className="text-sm text-gray-900" />
                ) : (
                  '—'
                )
              }
              className="mb-4"
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <DetailField label="Venue" value={event.venue} />
              <DetailField label="Speaker" value={event.speakerName} />
              <DetailField label="Time" value={event.timeLabel} />
            </div>
          </DetailCard>

          {event.type === 'Online' ? (
            <DetailCard title="Google Meet">
              <GoogleMeetFields
                meetLink={event.meetingUrl || event.meetingRoomId}
                totalSeats={event.maxAttendees}
                seatsRemaining={event.seatsRemaining}
              />
            </DetailCard>
          ) : null}

          <DetailCard title="Details">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <DetailField label="Start Date" value={formatAdminDate(event.dateStart)} />
              <DetailField label="End Date" value={formatAdminDate(event.dateEnd)} />
              <DetailField
                label="Price"
                value={`₹${Number(event.price).toLocaleString('en-IN')}`}
              />
              <DetailField
                label="Member Price"
                value={
                  event.memberPrice != null
                    ? `₹${Number(event.memberPrice).toLocaleString('en-IN')}`
                    : '—'
                }
              />
              <DetailField label="Max Attendees" value={event.maxAttendees ?? '—'} />
              <DetailField
                label="Registrations"
                value={
                  <Link
                    href={`/admin/registrations?eventId=${event.id}`}
                    className="font-medium text-purple-deep hover:text-gold-royal"
                  >
                    {event._count?.registrations ?? 0} registered
                  </Link>
                }
              />
            </div>
          </DetailCard>
        </div>

        <DetailCard title="Course Content">
          <EventContentManager eventId={event.id} />
        </DetailCard>
      </div>
    </AdminDetailLayout>
  );
}
