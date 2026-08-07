'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MessageSquare,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminGuard from '@/components/admin/AdminGuard';
import { toast } from '@/hooks/use-toast';
import { api, Event } from '@/lib/api';

export default function EventApprovalsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingEvent, setRejectingEvent] = useState<Event | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const loadEvents = () => {
    setLoading(true);
    api
      .getEvents(true)
      .then((data) => setEvents(data))
      .catch((err) => {
        toast({
          title: 'Could not load events',
          description: err instanceof Error ? err.message : 'Please try again',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleApprove = async (eventId: string) => {
    setSubmittingAction(true);
    try {
      await api.approveEvent(eventId);
      toast({
        title: 'Event Approved!',
        description: 'The event is now live and published.',
      });
      loadEvents();
    } catch (err) {
      toast({
        title: 'Approval failed',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingEvent) return;
    if (!rejectionReason.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please provide a reason for rejecting this event.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingAction(true);
    try {
      await api.rejectEvent(rejectingEvent.id, rejectionReason.trim());
      toast({
        title: 'Event Rejected',
        description: 'Rejection notice and feedback sent to host.',
      });
      setRejectingEvent(null);
      setRejectionReason('');
      loadEvents();
    } catch (err) {
      toast({
        title: 'Rejection failed',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  const pendingEvents = events.filter(
    (e) => e.status === 'PENDING_APPROVAL' || e.status === 'RESUBMITTED',
  );

  const displayedEvents =
    filter === 'pending'
      ? pendingEvents
      : events.filter((e) => e.status !== 'DRAFT');

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Approvals</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review, approve, or reject host event submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-gray-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filter === 'pending'
                    ? 'bg-white text-purple-deep shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Review ({pendingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filter === 'all'
                    ? 'bg-white text-purple-deep shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Submissions
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={loadEvents} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No events pending review</h3>
            <p className="text-sm text-gray-500 mt-1">
              All host submissions have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayedEvents.map((event) => {
              const isPending =
                event.status === 'PENDING_APPROVAL' || event.status === 'RESUBMITTED';
              const isRejected = event.status === 'REJECTED';
              const isApproved =
                event.status === 'APPROVED' || event.status === 'PUBLISHED';

              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-900">
                          {event.title}
                        </h2>
                        {event.status === 'PENDING_APPROVAL' && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                            <Clock className="w-3 h-3 mr-1" /> Pending Approval
                          </Badge>
                        )}
                        {event.status === 'RESUBMITTED' && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                            <RefreshCw className="w-3 h-3 mr-1" /> Resubmitted
                          </Badge>
                        )}
                        {isApproved && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            <XCircle className="w-3 h-3 mr-1" /> Rejected
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded bg-gray-100">
                          {event.type}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div>
                          <strong className="text-gray-700">Instructor:</strong>{' '}
                          {event.speakerName || event.host?.email || 'N/A'}
                        </div>
                        <div>
                          <strong className="text-gray-700">Date:</strong>{' '}
                          {new Date(event.dateStart).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div>
                          <strong className="text-gray-700">Price:</strong>{' '}
                          {Number(event.price) > 0 ? `₹${event.price}` : 'Free'}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description?.replace(/<[^>]*>/g, '') || 'No description provided.'}
                      </p>

                      {event.rejectionReason && (
                        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-200">
                          <strong>Previous Rejection Comment:</strong> {event.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center md:flex-col gap-2 shrink-0 border-t pt-4 md:border-t-0 md:pt-0">
                      <Link href={`/events/${event.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="w-full">
                          Preview <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>

                      {isPending && (
                        <>
                          <Button
                            size="sm"
                            disabled={submittingAction}
                            onClick={() => handleApprove(event.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={submittingAction}
                            onClick={() => {
                              setRejectingEvent(event);
                              setRejectionReason('');
                            }}
                            className="w-full"
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reject Modal with Comment Requirement */}
        <Dialog open={!!rejectingEvent} onOpenChange={(open) => !open && setRejectingEvent(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-700 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Reject Event Submission
              </DialogTitle>
              <DialogDescription>
                Provide constructive feedback explaining why <strong>{rejectingEvent?.title}</strong> is being rejected. The host will receive this comment by email to fix and resubmit.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Rejection Comment / Reason *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please update the venue address details and add a clearer course outline before resubmitting."
                rows={4}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setRejectingEvent(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={submittingAction || !rejectionReason.trim()}
                onClick={handleConfirmReject}
              >
                {submittingAction ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Reject Event & Notify Host'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
