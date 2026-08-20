import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event | GZURA',
  description:
    'Join GZURA events to network, learn, and grow with our community of leaders and entrepreneurs.',
};

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
