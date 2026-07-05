import { Event } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getEvents(options?: { fresh?: boolean }): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/events`, {
      ...(options?.fresh
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 60 } }),
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
    const init: RequestInit & { next?: { revalidate: number } } = {};

    if (options?.cache) {
      init.cache = options.cache;
    } else {
      init.next = { revalidate: 60 };
    }

    const res = await fetch(`${API_URL}/events/${encodeURIComponent(id)}`, init);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
