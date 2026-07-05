'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api';

export default function MeetEnrollmentGate({
  eventId,
  children,
}: {
  eventId: string;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=/events/${eventId}/meet`);
      return;
    }

    api
      .getMyRegistrations()
      .then((registrations) => {
        const enrolled = registrations.some(
          (registration) => registration.eventId === eventId,
        );

        if (!enrolled) {
          router.replace(`/events/${eventId}/register`);
          return;
        }

        setAllowed(true);
      })
      .catch(() => router.replace(`/home/events/${eventId}`));
  }, [user, loading, eventId, router]);

  if (loading || allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-deep">
        <Loader2 className="h-8 w-8 animate-spin text-gold-royal" />
      </div>
    );
  }

  return <>{children}</>;
}
