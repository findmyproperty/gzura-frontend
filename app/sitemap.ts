import type { MetadataRoute } from 'next';
import { getEvents } from '@/lib/events-server';
import { getSiteUrl } from '@/lib/site';

const PUBLIC_PATHS: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/programs', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/events', changeFrequency: 'daily', priority: 0.9 },
  { path: '/join', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/success-stories', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/careers', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/press', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = PUBLIC_PATHS.map((page) => ({
    url: `${siteUrl}${page.path === '/' ? '' : page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const events = await getEvents();
  const eventPages: MetadataRoute.Sitemap = events
    .filter((event) => event.status === 'PUBLISHED')
    .map((event) => ({
      url: `${siteUrl}/events/${event.id}`,
      lastModified: event.updatedAt ? new Date(event.updatedAt) : lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticPages, ...eventPages];
}
