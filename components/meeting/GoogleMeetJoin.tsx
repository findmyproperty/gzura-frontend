'use client';

import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMeetingSchedule } from '@/lib/meeting';

export default function GoogleMeetJoin({
  eventId,
  eventTitle,
  meetLink,
  dateStart,
  timeLabel,
  totalSeats,
  seatsRemaining,
}: {
  eventId: string;
  eventTitle: string;
  meetLink: string;
  dateStart: string;
  timeLabel?: string | null;
  totalSeats?: number | null;
  seatsRemaining?: number | null;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-deep via-purple-900 to-purple-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <Video className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-purple-deep mb-2">{eventTitle}</h1>
        <p className="text-gray-600 text-sm mb-6">
          Join this session on Google Meet at the scheduled time.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-purple-deep mt-0.5 shrink-0" />
            <span>{formatMeetingSchedule(dateStart, timeLabel)}</span>
          </div>
          {totalSeats ? (
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Users className="w-4 h-4 text-purple-deep mt-0.5 shrink-0" />
              <span>
                {seatsRemaining != null
                  ? `${seatsRemaining} of ${totalSeats} seats remaining`
                  : `${totalSeats} total seats`}
              </span>
            </div>
          ) : null}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-purple-deep mt-0.5 shrink-0" />
            <span>Open the Meet link when the host starts the session.</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="btn-secondary w-full h-11">
            <a href={meetLink} target="_blank" rel="noreferrer">
              Join Google Meet
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full h-11">
            <Link href={`/home/events/${eventId}`}>Back to event</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}