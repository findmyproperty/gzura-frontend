'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Video,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import EnrollmentSuccessDialog from '@/components/events/EnrollmentSuccessDialog';
import EventPassQr from '@/components/events/EventPassQr';
import { api, Event, EventRegistration } from '@/lib/api';
import { isFreeEventPrice } from '@/lib/price';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { toast } from '@/hooks/use-toast';

export default function EventDetailActions({ event }: { event: Event }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [joining, setJoining] = useState(false);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const hasMeetLink =
    event.type === 'Online' && (event.meetingUrl || event.meetingRoomId);
  const isFree = isFreeEventPrice(event.price);
  const meetUrl = event.meetingUrl || event.meetingRoomId || '';

  const loadEnrollment = useCallback(() => {
    if (!user) {
      setRegistration(null);
      setCheckingEnrollment(false);
      return;
    }

    setCheckingEnrollment(true);
    api
      .getMyRegistrations()
      .then((registrations) => {
        const match = registrations.find((row) => row.eventId === event.id) ?? null;
        setRegistration(match);
      })
      .catch(() => setRegistration(null))
      .finally(() => setCheckingEnrollment(false));
  }, [user, event.id]);

  useEffect(() => {
    loadEnrollment();
  }, [loadEnrollment]);

  const handleJoinSuccess = (result: EventRegistration) => {
    setRegistration(result);
    setSuccessOpen(true);
    toast({
      title: 'Course joined!',
      description: `${event.title} has been added to your learnings.`,
    });
  };

  const handleFreeJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }

    setJoining(true);
    try {
      const result = await api.joinEvent(event.id);
      handleJoinSuccess(result);
    } catch (err) {
      toast({
        title: 'Could not join course',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setJoining(false);
    }
  };

  const handlePaidJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }

    setJoining(true);
    try {
      const order = await api.createRazorpayOrder(event.id);

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'GZURA',
        description: order.eventTitle,
        orderId: order.orderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          contact: user.phone || undefined,
        },
        onSuccess: async (response) => {
          try {
            const result = await api.verifyRazorpayPayment({
              eventId: event.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            handleJoinSuccess(result);
          } catch (err) {
            toast({
              title: 'Payment verification failed',
              description: err instanceof Error ? err.message : 'Please contact support',
              variant: 'destructive',
            });
          } finally {
            setJoining(false);
          }
        },
        onDismiss: () => setJoining(false),
      });
    } catch (err) {
      if (err instanceof Error && err.message !== 'Payment cancelled') {
        toast({
          title: 'Payment could not start',
          description: err.message,
          variant: 'destructive',
        });
      }
      setJoining(false);
    }
  };

  if (authLoading || (user && checkingEnrollment)) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-purple-deep" />
      </div>
    );
  }

  if (registration) {
    return (
      <>
        <div className="space-y-3">
          {hasMeetLink ? (
            <Link href={`/events/${event.id}/meet`}>
              <Button className="btn-primary w-full">
                <Video className="mr-2 h-4 w-4" />
                Join Google Meet
              </Button>
            </Link>
          ) : null}

          {event.type === 'Offline' ? (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Venue
                </p>
                <p className="mt-1 flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-royal" />
                  <span>
                    {event.venue ? `${event.venue} — ` : ''}
                    {event.location}
                  </span>
                </p>
              </div>
              {registration.passUrl ? (
                <EventPassQr passUrl={registration.passUrl} size={150} />
              ) : null}
              {registration.passUrl ? (
                <a
                  href={registration.passUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-xs text-purple-deep hover:underline"
                >
                  Open entry pass
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          ) : null}

          {meetUrl && event.type === 'Online' ? (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-purple-deep hover:underline"
            >
              Open Meet link
              <ExternalLink className="h-3 w-3" />
            </a>
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

        <EnrollmentSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          event={event}
          registration={registration}
        />
      </>
    );
  }

  if (!user) {
    return (
      <Link href={`/login?redirect=/events/${event.id}`}>
        <Button className="btn-secondary w-full">
          {isFree ? 'Sign in to join free' : 'Sign in to join'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        className="btn-secondary w-full"
        disabled={joining}
        onClick={isFree ? handleFreeJoin : handlePaidJoin}
      >
        {joining ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {isFree ? 'Join for free' : 'Pay & join'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

    </>
  );
}