import type { Event } from '@/lib/api';

export function getEventImages(event: Pick<Event, 'galleryImages' | 'imageUrl'>) {
  if (event.galleryImages?.length) return event.galleryImages;
  if (event.imageUrl) return [event.imageUrl];
  return [];
}

export function getEventCoverImage(event: Pick<Event, 'galleryImages' | 'imageUrl'>) {
  return getEventImages(event)[0] ?? null;
}
