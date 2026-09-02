'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { api, getToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Sends a meet-ping using fetch with keepalive:true.
 * keepalive allows the request to complete even after the page is unloaded,
 * and unlike sendBeacon it supports custom Authorization headers.
 */
function sendMeetPing(eventId: string, action: 'JOIN' | 'LEAVE', token: string) {
  fetch(`${API_URL}/registrations/meet-ping`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId, action }),
    keepalive: true,
  }).catch(() => {});
}


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
  const hasJoined = useRef(false);

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

        void api.markEventAttended(eventId).catch(() => {});
        setAllowed(true);
      })
      .catch(() => router.replace(`/home/events/${eventId}`));
  }, [user, loading, eventId, router]);

  // Fire JOIN ping once the user is allowed in
  useEffect(() => {
    if (!allowed || hasJoined.current) return;
    hasJoined.current = true;

    const token = getToken();
    if (!token) return;

    sendMeetPing(eventId, 'JOIN', token);

    // Fire LEAVE ping when the user navigates away or closes the tab
    const handleLeave = () => {
      sendMeetPing(eventId, 'LEAVE', token);
    };

    // visibilitychange covers tab switching / navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendMeetPing(eventId, 'LEAVE', token);
      } else if (document.visibilityState === 'visible') {
        // Re-joined the tab — log a JOIN again
        sendMeetPing(eventId, 'JOIN', token);
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Fire LEAVE when the component unmounts (SPA navigation)
      sendMeetPing(eventId, 'LEAVE', token);
    };
  }, [allowed, eventId]);


  if (loading || allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-deep">
        <Loader2 className="h-8 w-8 animate-spin text-gold-royal" />
      </div>
    );
  }

  return <>{children}</>;
}
