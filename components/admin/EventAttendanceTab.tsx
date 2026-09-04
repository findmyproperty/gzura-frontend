'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  XCircle,
  Users,
  Video,
} from 'lucide-react';
import { api, AttendanceSummaryRow } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function exportToCsv(rows: AttendanceSummaryRow[], eventTitle: string) {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Status (Manual)',
    'Calculated Status',
    'Verification Source',
    'First Joined',
    'Last Left',
    'Total Duration',
    'Session Count',
  ];

  const csvRows = rows.map((r) => [
    r.fullName,
    r.email,
    r.phone ?? '',
    r.attendanceStatus ?? r.calculatedStatus,
    r.calculatedStatus,
    r.isGoogleVerified ? 'Google Meet API' : 'Platform Gate',
    r.firstJoinedAt ? new Date(r.firstJoinedAt).toLocaleString() : '',
    r.lastLeftAt ? new Date(r.lastLeftAt).toLocaleString() : '',
    formatDuration(r.totalDurationSeconds),
    String(r.sessionCount),
  ]);

  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EventAttendanceTab({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const [rows, setRows] = useState<AttendanceSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const data = await api.getEventAttendance(eventId);
        setRows(data);
      } catch {
        if (!silent) {
          toast({
            title: 'Failed to load attendance',
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId],
  );

  const handleSyncGoogle = async () => {
    setSyncingGoogle(true);
    try {
      const res = await api.syncGoogleMeetAttendance(eventId);
      if (res.summary) {
        setRows(res.summary);
      }
      toast({
        title: 'Google Meet Sync Complete',
        description: res.message,
      });
    } catch (err: any) {
      toast({
        title: 'Google Meet Sync Failed',
        description:
          err?.message ||
          'Could not retrieve Google Meet conference records. Check if meeting has ended.',
        variant: 'destructive',
      });
    } finally {
      setSyncingGoogle(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleStatusChange = async (
    registrationId: string,
    status: 'present' | 'absent',
  ) => {
    setUpdatingId(registrationId);
    try {
      await api.updateAttendanceStatus(registrationId, status);
      setRows((prev) =>
        prev.map((r) =>
          r.registrationId === registrationId
            ? { ...r, attendanceStatus: status }
            : r,
        ),
      );
      toast({ title: `Marked ${status}` });
    } catch {
      toast({
        title: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const presentCount = rows.filter(
    (r) => (r.attendanceStatus ?? r.calculatedStatus) === 'present',
  ).length;
  const absentCount = rows.length - presentCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw className="h-6 w-6 animate-spin text-purple-deep" />
        <span className="ml-3 text-sm text-gray-500">Loading attendance…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar: Responsive stats and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {presentCount} Present
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-700 bg-red-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {absentCount} Absent
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {rows.length} Total
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium"
            onClick={handleSyncGoogle}
            disabled={syncingGoogle || refreshing}
          >
            <Video className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 ${syncingGoogle ? 'animate-spin' : ''}`} />
            {syncingGoogle ? 'Syncing...' : 'Sync Meet'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
            onClick={() => void fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
            onClick={() => exportToCsv(rows, eventTitle)}
            disabled={rows.length === 0}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
          <Users className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm font-medium">No registrations yet</p>
          <p className="text-gray-400 text-xs mt-1">Attendance data will appear once users join the meeting page.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (Visible on <md screens) */}
          <div className="md:hidden space-y-3">
            {rows.map((row) => {
              const effectiveStatus = row.attendanceStatus ?? row.calculatedStatus;
              const isPresent = effectiveStatus === 'present';
              const isUpdating = updatingId === row.registrationId;

              return (
                <div
                  key={`mobile-${row.registrationId}`}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{row.fullName}</p>
                      <p className="text-gray-500 text-xs truncate">{row.email}</p>
                      {row.phone && <p className="text-gray-400 text-[11px] mt-0.5">{row.phone}</p>}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <select
                        id={`mobile-attendance-status-${row.registrationId}`}
                        value={effectiveStatus}
                        disabled={isUpdating}
                        onChange={(e) =>
                          void handleStatusChange(
                            row.registrationId,
                            e.target.value as 'present' | 'absent',
                          )
                        }
                        className={`
                          text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer
                          appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400
                          disabled:opacity-60 disabled:cursor-wait
                          ${isPresent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}
                      >
                        <option value="present">✓ Present</option>
                        <option value="absent">✗ Absent</option>
                      </select>
                      {row.attendanceStatus !== null && (
                        <span className="text-[10px] text-gray-400">(manual)</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-xs">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Duration</span>
                      <span className={`font-semibold ${row.totalDurationSeconds > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
                        {formatDuration(row.totalDurationSeconds)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Sessions</span>
                      <span className="text-gray-700 font-medium">
                        {row.sessionCount > 0 ? `${row.sessionCount}×` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">First Joined</span>
                      <span className="text-gray-600 text-[11px]">
                        {formatDateTime(row.firstJoinedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Source</span>
                      {row.isGoogleVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                          Google
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          Platform Gate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop / Tablet Table View (Hidden on <md screens) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> First Joined</span>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Last Left</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Total Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => {
                  const effectiveStatus = row.attendanceStatus ?? row.calculatedStatus;
                  const isPresent = effectiveStatus === 'present';
                  const isUpdating = updatingId === row.registrationId;

                  return (
                    <tr
                      key={row.registrationId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {row.fullName}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {row.email}
                      </td>

                      {/* Status dropdown */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          id={`attendance-status-${row.registrationId}`}
                          value={effectiveStatus}
                          disabled={isUpdating}
                          onChange={(e) =>
                            void handleStatusChange(
                              row.registrationId,
                              e.target.value as 'present' | 'absent',
                            )
                          }
                          className={`
                            text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer
                            appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400
                            disabled:opacity-60 disabled:cursor-wait
                            ${isPresent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                            }
                          `}
                        >
                          <option value="present">✓ Present</option>
                          <option value="absent">✗ Absent</option>
                        </select>
                        {row.attendanceStatus !== null && (
                          <span className="ml-1.5 text-xs text-gray-400">(manual)</span>
                        )}
                      </td>

                      {/* Source badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.isGoogleVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            Google Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                            Platform Gate
                          </span>
                        )}
                      </td>

                      {/* First joined */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {formatDateTime(row.firstJoinedAt)}
                      </td>

                      {/* Last left */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {formatDateTime(row.lastLeftAt)}
                      </td>

                      {/* Total duration */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${row.totalDurationSeconds > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
                          {formatDuration(row.totalDurationSeconds)}
                        </span>
                      </td>

                      {/* Session count */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {row.sessionCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-medium rounded-full px-2 py-0.5">
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
  );
}
