'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Hash,
  Loader2,
  ScanLine,
  User,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminPageHeader } from '@/components/admin/admin-chrome';
import { formatAdminDateTime } from '@/components/admin/AdminDataTable';
import { api, Event, PassValidationResult } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

function extractAccessToken(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/\/pass\/([a-f0-9-]+)/i);
  return match?.[1] ?? trimmed;
}

type ScanRecord = PassValidationResult & { scannedAt: string };

function ViewfinderCorners() {
  return (
    <svg
      className="pointer-events-none absolute inset-8 text-gold-royal sm:inset-10"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <path d="M18 2 H2 V18" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M82 2 H98 V18" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M98 82 V98 H82" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M18 98 H2 V82" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

export default function AdminQrScannerPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const mountId = useId().replace(/:/g, '');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const stoppingRef = useRef(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState<PassValidationResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      return;
    }
    api
      .getEvent(eventId, true)
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [eventId]);

  const stopScanner = useCallback(async () => {
    if (!scannerRef.current || stoppingRef.current) {
      setScanning(false);
      return;
    }

    stoppingRef.current = true;
    const scanner = scannerRef.current;
    scannerRef.current = null;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Scanner may already be stopped.
    }

    try {
      scanner.clear();
    } catch {
      // clear() can fail if the library already removed its nodes.
    }

    stoppingRef.current = false;
    setScanning(false);
  }, []);

  const handleScan = useCallback(
    async (decodedText: string) => {
      const token = extractAccessToken(decodedText);
      if (!token) return;

      setLoading(true);
      try {
        const validation = await api.checkInPass(token, eventId || undefined);
        setResult(validation);
        setRecentScans((prev) =>
          [{ ...validation, scannedAt: new Date().toISOString() }, ...prev].slice(0, 12),
        );

        if (validation.valid) {
          toast({
            title:
              validation.status === 'already_checked_in'
                ? 'Already present'
                : 'Attendance marked',
            description: `${validation.attendee?.fullName} — ${validation.attendee?.eventTitle}`,
          });
        } else {
          toast({
            title: 'Invalid pass',
            description: validation.message,
            variant: 'destructive',
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Scan failed';
        setResult({
          valid: false,
          status: 'invalid',
          message,
        });
        toast({
          title: 'Scan failed',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [eventId],
  );

  const startScanner = useCallback(async () => {
    setResult(null);

    await stopScanner();

    const scanner = new Html5Qrcode(mountId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.max(160, Math.floor(edge * 0.68));
            return { width: size, height: size };
          },
          aspectRatio: 1,
        },
        async (decodedText) => {
          await stopScanner();
          await handleScan(decodedText);
        },
        () => undefined,
      );
      setScanning(true);
    } catch (err) {
      scannerRef.current = null;
      setScanning(false);
      toast({
        title: 'Camera unavailable',
        description:
          err instanceof Error
            ? err.message
            : 'Allow camera access to scan entry passes.',
        variant: 'destructive',
      });
    }
  }, [handleScan, mountId, stopScanner]);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  const scopedOffline = event ? event.type === 'Offline' : true;
  const resultTone =
    result?.status === 'already_checked_in'
      ? 'amber'
      : result?.valid
        ? 'emerald'
        : result
          ? 'red'
          : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-6">
      <AdminPageHeader
        breadcrumb={eventId ? 'Admin / Events' : 'Admin'}
        title="Scan attendance"
        subtitle={
          event
            ? `Check in students for ${event.title}.`
            : 'Scan a student pass or enter the number.'
        }
      />

      {eventId ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/admin/events/${eventId}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to event
          </Link>
          {event && event.type !== 'Offline' ? (
            <p className="text-sm text-amber-700">QR attendance is only for offline events.</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <section className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative mx-auto w-full max-w-[22rem]">
            <div className="qr-viewport rounded-[22px] ring-1 ring-purple-deep/10">
              <div id={mountId} className="h-full w-full" />
              {!scanning ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <ScanLine className="h-7 w-7 text-gold-royal" />
                  </div>
                  <p className="text-sm font-medium text-white">Ready to scan</p>
                  <p className="mt-1 text-xs text-white/70">Hold the pass inside the frame</p>
                </div>
              ) : (
                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-royal" />
                  Live
                </div>
              )}
              <ViewfinderCorners />
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-deep/40">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-[22rem] flex-col gap-3">
            {scanning ? (
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl text-base font-semibold"
                onClick={stopScanner}
              >
                Stop
              </Button>
            ) : (
              <Button
                className="btn-admin h-12 w-full rounded-xl text-base"
                onClick={startScanner}
                disabled={loading || !scopedOffline}
              >
                <ScanLine className="mr-2 h-5 w-5" />
                Start
              </Button>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualToken.trim()) return;
                void stopScanner();
                void handleScan(manualToken);
                setManualToken('');
              }}
            >
              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Enter number"
                  inputMode="text"
                  autoComplete="off"
                  disabled={loading || !scopedOffline}
                  aria-label="Enter number"
                  className="h-12 rounded-xl border-gray-200 pl-10 text-base shadow-none focus-visible:ring-gold-royal"
                />
              </div>
            </form>
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-4">
          {result && resultTone ? (
            <div
              className={cn(
                'rounded-[24px] border p-4 sm:p-5',
                resultTone === 'emerald' && 'border-emerald-200 bg-emerald-50',
                resultTone === 'amber' && 'border-amber-200 bg-amber-50',
                resultTone === 'red' && 'border-red-200 bg-red-50',
              )}
            >
              <div className="flex items-start gap-3">
                {resultTone === 'emerald' ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                ) : resultTone === 'amber' ? (
                  <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                ) : (
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                )}
                <div className="min-w-0 flex-1">
                  <h2
                    className={cn(
                      'text-lg font-semibold',
                      resultTone === 'emerald' && 'text-emerald-800',
                      resultTone === 'amber' && 'text-amber-900',
                      resultTone === 'red' && 'text-red-800',
                    )}
                  >
                    {result.valid
                      ? result.status === 'already_checked_in'
                        ? 'Already marked present'
                        : 'Attendance marked'
                      : 'Not a valid pass'}
                  </h2>
                  <p
                    className={cn(
                      'mt-1 text-sm',
                      resultTone === 'emerald' && 'text-emerald-700',
                      resultTone === 'amber' && 'text-amber-800',
                      resultTone === 'red' && 'text-red-700',
                    )}
                  >
                    {result.message}
                  </p>
                  {result.attendee ? (
                    <div className="mt-4 space-y-1 rounded-xl bg-white/80 p-4 text-sm text-gray-800">
                      <p>
                        <strong>Student:</strong> {result.attendee.fullName}
                      </p>
                      <p className="break-all">
                        <strong>Email:</strong> {result.attendee.email}
                      </p>
                      <p>
                        <strong>Event:</strong> {result.attendee.eventTitle}
                      </p>
                      <p>
                        <strong>Venue:</strong> {result.attendee.venue}
                      </p>
                      {result.checkedInAt ? (
                        <p>
                          <strong>Present at:</strong> {formatAdminDateTime(result.checkedInAt)}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {!result.valid ? (
                    <div className="mt-4 flex items-center gap-2 text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      Do not mark this student present.
                    </div>
                  ) : result.attendee?.eventId ? (
                    <Button asChild variant="outline" className="mt-4 h-11 w-full sm:w-auto">
                      <Link href={`/admin/events/${result.attendee.eventId}`}>
                        View attendance list
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden rounded-[24px] border border-dashed border-gray-200 bg-[#F8F6FB] px-5 py-8 text-center lg:block">
              <ScanLine className="mx-auto h-8 w-8 text-purple-deep/30" />
              <p className="mt-3 text-sm font-medium text-zinc-800">Waiting for a pass</p>
              <p className="mt-1 text-sm text-gray-500">
                Press Start to scan, or type the pass number.
              </p>
            </div>
          )}

          {recentScans.length > 0 ? (
            <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <h3 className="mb-3 text-sm font-semibold text-zinc-900">This session</h3>
              <div className="max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto">
                {recentScans.map((scan, index) => (
                  <div
                    key={`${scan.attendee?.id || scan.message}-${scan.scannedAt}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 shrink-0 text-purple-deep" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {scan.attendee?.fullName || 'Unknown pass'}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {scan.valid ? scan.attendee?.eventTitle : scan.message}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 text-xs font-semibold',
                        scan.status === 'checked_in' && 'text-emerald-700',
                        scan.status === 'already_checked_in' && 'text-amber-700',
                        scan.status !== 'checked_in' &&
                          scan.status !== 'already_checked_in' &&
                          'text-red-600',
                      )}
                    >
                      {scan.status === 'checked_in'
                        ? 'Present'
                        : scan.status === 'already_checked_in'
                          ? 'Already in'
                          : 'Invalid'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
