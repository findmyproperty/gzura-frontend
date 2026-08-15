import { Event } from './api';
import {
  EVENTS_CACHE_TAG,
  EVENTS_REVALIDATE_SECONDS,
  eventCacheTag,
} from './events-cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export async function getEvents(options?: { fresh?: boolean }): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/events`, {
      ...(options?.fresh
        ? { cache: 'no-store' as const }
        : {
            next: {
              revalidate: EVENTS_REVALIDATE_SECONDS,
              tags: [EVENTS_CACHE_TAG],
            },
          }),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getEvent(
  id: string,
  options?: { cache?: RequestCache },
): Promise<Event | null> {
  try {
    const init: RequestInit & { next?: { revalidate: number; tags: string[] } } = {};

    if (options?.cache) {
      init.cache = options.cache;
    } else {
      init.next = {
        revalidate: EVENTS_REVALIDATE_SECONDS,
        tags: [EVENTS_CACHE_TAG, eventCacheTag(id)],
      };
    }

    const res = await fetch(`${API_URL}/events/${encodeURIComponent(id)}`, init);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
