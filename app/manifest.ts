import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GZURA | Empowering Men & Women Entrepreneurs',
    short_name: 'GZURA',
    description:
      'GZURA is a platform dedicated to entrepreneurship, leadership development, networking, and personal growth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2D0A4E',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
