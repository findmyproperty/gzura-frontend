import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event | GZURA',
};

export default function MemberEventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
