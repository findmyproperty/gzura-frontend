/** Shared cache keys for public event pages (Next.js ISR). */
export const EVENTS_CACHE_TAG = 'events';
export const EVENTS_REVALIDATE_SECONDS = 60;

export function eventCacheTag(id: string) {
  return `event:${id}`;
}
