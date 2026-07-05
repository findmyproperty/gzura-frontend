import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GoogleMeetJoin from '@/components/meeting/GoogleMeetJoin';
import MeetEnrollmentGate from '@/components/meeting/MeetEnrollmentGate';
import { getEvent } from '@/lib/events-server';
import { isGoogleMeetLink } from '@/lib/meeting';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.id, { cache: 'no-store' });
  return {
    title: event ? `Google Meet: ${event.title} | GZURA` : 'Google Meet | GZURA',
  };
}

export default async function EventMeetPage({ params }: Props) {
  const event = await getEvent(params.id, { cache: 'no-store' });

  const meetLink = isGoogleMeetLink(event?.meetingUrl)
    ? event?.meetingUrl
    : isGoogleMeetLink(event?.meetingRoomId)
      ? event?.meetingRoomId
      : null;

  if (!event || event.type !== 'Online' || !meetLink) {
    notFound();
  }

  return (
    <MeetEnrollmentGate eventId={event.id}>
      <GoogleMeetJoin
        eventId={event.id}
        eventTitle={event.title}
        meetLink={meetLink}
        dateStart={event.dateStart}
        timeLabel={event.timeLabel}
        totalSeats={event.maxAttendees}
        seatsRemaining={event.seatsRemaining}
      />
    </MeetEnrollmentGate>
  );
}