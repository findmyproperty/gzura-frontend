'use client';

import { useParams } from 'next/navigation';
import EventDetailClient from '@/components/events/EventDetailClient';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <EventDetailClient
      eventId={id}
      backHref="/events"
      backLabel="← All Events"
      shell="public"
    />
  );
}
