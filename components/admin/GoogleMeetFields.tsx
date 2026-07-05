'use client';

import { Copy, ExternalLink, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export function GoogleMeetFields({
  meetLink,
  totalSeats,
  seatsRemaining,
}: {
  meetLink?: string | null;
  totalSeats?: number | null;
  seatsRemaining?: number | null;
}) {
  const copyLink = async () => {
    if (!meetLink) return;
    try {
      await navigator.clipboard.writeText(meetLink);
      toast({ title: 'Google Meet link copied' });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 space-y-3">
      <div className="flex items-center gap-2 text-emerald-800">
        <Video className="w-4 h-4" />
        <p className="text-sm font-semibold">Google Meet</p>
      </div>
      <p className="text-xs text-gray-600">
        A Google Meet room is created automatically when you save an online event.
      </p>

      {totalSeats ? (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-emerald-100 bg-white px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Total seats
            </p>
            <p className="text-sm font-semibold text-gray-900">{totalSeats}</p>
          </div>
          {seatsRemaining != null ? (
            <div className="rounded-lg border border-emerald-100 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Seats remaining
              </p>
              <p className="text-sm font-semibold text-gray-900">{seatsRemaining}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {meetLink ? (
        <div className="space-y-2">
          <Label>Meeting link</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={meetLink}
              title={meetLink}
              className="bg-white font-mono text-xs"
            />
            <Button type="button" variant="outline" onClick={copyLink}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" asChild>
              <a href={meetLink} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          Save this online event to generate the Google Meet link.
        </p>
      )}
    </div>
  );
}