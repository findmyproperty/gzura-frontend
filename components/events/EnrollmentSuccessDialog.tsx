'use client';

import Link from 'next/link';
import { CheckCircle2, ExternalLink, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventPassQr from '@/components/events/EventPassQr';
import { Event, EventRegistration } from '@/lib/api';

export default function EnrollmentSuccessDialog({
  open,
  onOpenChange,
  event,
  registration,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  registration: EventRegistration;
}) {
  const isOnline = event.type === 'Online';
  const meetUrl = event.meetingUrl || event.meetingRoomId || '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-center text-xl">You&apos;re enrolled!</DialogTitle>
          <DialogDescription className="text-center">
            {event.title} has been added to your courses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isOnline && meetUrl ? (
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
              <p className="mb-3 text-sm font-medium text-purple-deep">
                Join this session on Google Meet
              </p>
              <Link href={`/events/${event.id}/meet`}>
                <Button className="btn-primary w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Join Google Meet
                </Button>
              </Link>
              <a
                href={meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1 text-xs text-purple-deep hover:underline"
              >
                Open Meet link
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : null}

          {!isOnline ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-purple-deep mb-1">Venue address</p>
                <p className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-royal" />
                  <span>
                    {event.venue ? `${event.venue} — ` : ''}
                    {event.location}
                  </span>
                </p>
              </div>
              {registration.passUrl ? (
                <EventPassQr passUrl={registration.passUrl} />
              ) : null}
            </div>
          ) : null}

          <Link href="/my-learnings">
            <Button variant="outline" className="w-full">
              View My Learnings
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}