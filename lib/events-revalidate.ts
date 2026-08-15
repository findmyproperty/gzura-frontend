'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { EVENTS_CACHE_TAG, eventCacheTag } from '@/lib/events-cache';

/**
 * On-demand ISR: clear the events list and (optionally) a specific event page.
 * @see https://nextjs.org/docs/app/guides/incremental-static-regeneration
 */
export async function revalidateEventsCache(eventIds?: string | string[]) {
  try {
    revalidateTag(EVENTS_CACHE_TAG);
    revalidatePath('/events');
    revalidatePath('/sitemap.xml');

    const ids = eventIds == null ? [] : Array.isArray(eventIds) ? eventIds : [eventIds];

    for (const id of ids) {
      if (!id) continue;
      revalidateTag(eventCacheTag(id));
      revalidatePath(`/events/${id}`);
      revalidatePath(`/events/${id}/register`);
      revalidatePath(`/home/events/${id}`);
    }
  } catch {
    // Best-effort: a failed cache clear must not block the admin save.
  }
}
