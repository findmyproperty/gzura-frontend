import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailView from '@/components/events/EventDetailView';
import { getEvent } from '@/lib/events-server';
import { richTextExcerpt } from '@/lib/rich-text';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.id);
  return {
    title: event ? `${event.title} | GZURA` : 'Event | GZURA',
    description: event?.description ? richTextExcerpt(event.description, 160) : undefined,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  return (
    <EventDetailView
      event={event}
      backHref="/events"
      backLabel="← All Events"
      shell="public"
    />
  );
}