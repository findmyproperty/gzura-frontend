'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  RefreshCw,
  StopCircle,
  Users,
  Video,
  Wifi,
  XCircle,
  Radio,
} from 'lucide-react';
import { api, AttendanceSummaryRow, Event, getToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { isGoogleMeetLink } from '@/lib/meeting';
import { useAuth } from '@/components/providers/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

function sendHostPing(eventId: string, action: 'JOIN' | 'LEAVE', token: string) {
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

function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatJoinTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function resolveMeetLink(event: Event): string | null {
  if (isGoogleMeetLink(event.meetingUrl)) return event.meetingUrl!;
  if (isGoogleMeetLink(event.meetingRoomId)) return event.meetingRoomId!;
  return event.meetingUrl || event.meetingRoomId || null;
}

export default function HostSessionPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [attendees, setAttendees] = useState<AttendanceSummaryRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const sessionStartRef = useRef<Date>(new Date());
  const hasJoined = useRef(false);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  // Load event
  useEffect(() => {
    api
      .getEvent(eventId, true)
      .then((evt) => {
        if (user && user.role === 'HOST' && evt.hostId && evt.hostId !== user.id) {
          toast({
            title: 'Unauthorized',
            description: 'Only the assigned host or an admin can host this session.',
            variant: 'destructive',
          });
          router.replace('/admin/events');
          return;
        }
        setEvent(evt);
      })
      .catch(() => {
        toast({ title: 'Event not found', variant: 'destructive' });
        router.replace(`/admin/events`);
      })
      .finally(() => setPageLoading(false));
  }, [eventId, router, user]);

  // Session timer (counts up every second)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionSeconds(
        Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000),
      );
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // JOIN ping on mount, LEAVE ping on unmount / page unload
  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;

    const token = getToken();
    if (!token) return;

    sendHostPing(eventId, 'JOIN', token);

    const handleLeave = () => sendHostPing(eventId, 'LEAVE', token);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendHostPing(eventId, 'LEAVE', token);
      } else if (document.visibilityState === 'visible') {
        sendHostPing(eventId, 'JOIN', token);
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      sendHostPing(eventId, 'LEAVE', token);
    };
  }, [eventId]);

  // Fetch live attendee list
  const fetchAttendees = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true);
      try {
        const data = await api.getEventAttendance(eventId);
        setAttendees(data);
        setLastRefreshed(new Date());
      } catch {
        // silent fail
      } finally {
        setRefreshing(false);
      }
    },
    [eventId],
  );

  // Initial fetch + 30s auto-refresh
  useEffect(() => {
    void fetchAttendees(false);
    autoRefreshRef.current = setInterval(() => void fetchAttendees(true), 30_000);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [fetchAttendees]);

  const handleEndSession = () => {
    const token = getToken();
    if (token) sendHostPing(eventId, 'LEAVE', token);
    router.replace(`/admin/events/${eventId}`);
  };

  const copyMeetLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: 'Google Meet link copied!' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const presentCount = attendees.filter(
    (a) => (a.attendanceStatus ?? a.calculatedStatus) === 'present',
  ).length;
  const absentCount = attendees.length - presentCount;
  const meetLink = event ? resolveMeetLink(event) : null;

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-deep">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Video className="w-7 h-7 text-white animate-pulse" />
          </div>
          <p className="text-white/60 text-sm">Preparing your session…</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/admin/events/${eventId}`}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-gray-900 font-semibold text-sm truncate">{event.title}</span>
            </div>
          </div>

          {/* Session timer */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 shrink-0">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-gray-900 font-mono font-bold text-lg tracking-widest">
              {formatTimer(sessionSeconds)}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleEndSession}
          >
            <StopCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        {/* Meet link card */}
        <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-800 text-xs font-semibold uppercase tracking-widest mb-0.5">
                Google Meet Session
              </p>
              <p className="text-gray-600 text-xs truncate font-mono">
                {meetLink ?? 'No meet link configured'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {meetLink ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => void copyMeetLink(meetLink)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
                <Button
                  id="host-open-google-meet"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                  asChild
                >
                  <a href={meetLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Google Meet
                  </a>
                </Button>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No meet link configured for this event</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Registered',
              value: attendees.length,
              icon: Users,
              color: 'bg-white border-gray-200',
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-600',
            },
            {
              label: 'Present',
              value: presentCount,
              icon: CheckCircle2,
              color: 'bg-white border-gray-200',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Not joined',
              value: absentCount,
              icon: XCircle,
              color: 'bg-white border-gray-200',
              iconBg: 'bg-red-100',
              iconColor: 'text-red-600',
            },
          ].map(({ label, value, icon: Icon, color, iconBg, iconColor }) => (
            <div
              key={label}
              className={`rounded-2xl ${color} border p-4 flex items-center gap-4 shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live attendee table */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <h2 className="text-gray-900 font-semibold text-sm">Live Attendees</h2>
              <span className="text-gray-400 text-xs">
                · refreshed {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 gap-2"
              onClick={() => void fetchAttendees(false)}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {attendees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No registrations yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Attendees will appear here once they visit the meeting page.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Attendee Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {attendees.map((row) => {
                  const effectiveStatus = row.attendanceStatus ?? row.calculatedStatus;
                  const isPresent = effectiveStatus === 'present';

                  return (
                    <div key={`mobile-attendee-${row.registrationId}`} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isPresent ? 'bg-emerald-500' : 'bg-gray-200'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-gray-900 font-semibold text-sm truncate">{row.fullName}</p>
                            <p className="text-gray-500 text-xs truncate">{row.email}</p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 shrink-0 ${
                            isPresent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {isPresent ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400 text-[11px] block">Total Time</span>
                          <span className={`font-semibold ${row.totalDurationSeconds > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
                            {formatDuration(row.totalDurationSeconds)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[11px] block">Sessions</span>
                          <span className="font-medium text-gray-800">
                            {row.sessionCount > 0 ? `${row.sessionCount}×` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[11px] block">First Joined</span>
                          <span className="text-[11px]">{formatJoinTime(row.firstJoinedAt)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[11px] block">Last Left</span>
                          <span className="text-[11px]">{formatJoinTime(row.lastLeftAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {['Attendee', 'Status', 'First Joined', 'Last Left', 'Total Time', 'Sessions'].map(
                        (col) => (
                          <th
                            key={col}
                            className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendees.map((row) => {
                      const effectiveStatus =
                        row.attendanceStatus ?? row.calculatedStatus;
                      const isPresent = effectiveStatus === 'present';

                      return (
                        <tr
                          key={row.registrationId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Attendee */}
                          <td className="px-5 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isPresent ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}
                              />
                              <div>
                                <p className="text-gray-900 font-medium">{row.fullName}</p>
                                <p className="text-gray-500 text-xs">{row.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Status badge */}
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 ${
                                isPresent
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {isPresent ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {isPresent ? 'Present' : 'Absent'}
                            </span>
                          </td>

                          {/* First joined */}
                          <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                            {row.firstJoinedAt ? (
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-emerald-600" />
                                {formatJoinTime(row.firstJoinedAt)}
                              </span>
                            ) : '—'}
                          </td>

                          {/* Last left */}
                          <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                            {formatJoinTime(row.lastLeftAt)}
                          </td>

                          {/* Total duration */}
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span
                              className={`font-semibold text-sm ${
                                row.totalDurationSeconds > 0
                                  ? 'text-purple-700'
                                  : 'text-gray-400'
                              }`}
                            >
                              {formatDuration(row.totalDurationSeconds)}
                            </span>
                          </td>

                          {/* Session count */}
                          <td className="px-5 py-3 whitespace-nowrap">
                            {row.sessionCount > 0 ? (
                              <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 font-medium rounded-full px-2 py-0.5">
                                {row.sessionCount}×
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-gray-400 text-xs">
          Attendee data refreshes every 30 seconds automatically · Only members who visited the meeting page are tracked
        </p>
      </div>
    </div>
  );
}
