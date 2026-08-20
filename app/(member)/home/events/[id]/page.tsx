'use client';

import { useParams } from 'next/navigation';
import EventDetailClient from '@/components/events/EventDetailClient';

export default function MemberEventDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <EventDetailClient
      eventId={id}
      backHref="/home"
      backLabel="← Back to dashboard"
      shell="member"
    />
  );
}
