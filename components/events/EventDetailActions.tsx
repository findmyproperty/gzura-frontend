'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, Video } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { api, Event } from '@/lib/api';

export default function EventDetailActions({ event }: { event: Event }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const hasMeetLink =
    event.type === 'Online' && (event.meetingUrl || event.meetingRoomId);

  useEffect(() => {
    if (!user) {
      setIsEnrolled(false);
      setCheckingEnrollment(false);
      return;
    }

    setCheckingEnrollment(true);
    api
      .getMyRegistrations()
      .then((registrations) =>
        setIsEnrolled(registrations.some((registration) => registration.eventId === event.id)),
      )
      .catch(() => setIsEnrolled(false))
      .finally(() => setCheckingEnrollment(false));
  }, [user, event.id]);

  if (authLoading || (user && checkingEnrollment)) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-purple-deep" />
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className="space-y-3">
        {hasMeetLink ? (
          <Link href={`/events/${event.id}/meet`}>
            <Button className="btn-primary w-full">
              <Video className="mr-2 h-4 w-4" />
              Join Google Meet
            </Button>
          </Link>
        ) : null}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          You&apos;re enrolled in this course
        </div>
        <Link href="/my-learnings">
          <Button variant="outline" className="w-full">
            View My Learnings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/events/${event.id}/register`}>
      <Button className="btn-secondary w-full">
        Join Course
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
}
