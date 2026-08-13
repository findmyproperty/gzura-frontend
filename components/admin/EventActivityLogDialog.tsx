'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FilePenLine,
  History,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatAdminDateTime } from '@/components/admin/AdminDataTable';
import type { Event, EventActivityAction, EventActivityLog } from '@/lib/api';
import { cn } from '@/lib/utils';

const ACTION_META: Record<
  EventActivityAction,
  {
    label: string;
    icon: typeof History;
    tone: string;
    iconWrap: string;
  }
> = {
  CREATED: {
    label: 'Created',
    icon: Sparkles,
    tone: 'text-purple-deep',
    iconWrap: 'bg-purple-100 text-purple-deep',
  },
  SUBMITTED: {
    label: 'Submitted for review',
    icon: Send,
    tone: 'text-amber-700',
    iconWrap: 'bg-amber-100 text-amber-700',
  },
  REJECTED: {
    label: 'Rejected',
    icon: AlertCircle,
    tone: 'text-red-700',
    iconWrap: 'bg-red-100 text-red-600',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle2,
    tone: 'text-emerald-700',
    iconWrap: 'bg-emerald-100 text-emerald-700',
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    icon: RefreshCw,
    tone: 'text-blue-700',
    iconWrap: 'bg-blue-100 text-blue-700',
  },
  CHANGES_SUBMITTED: {
    label: 'Edits submitted',
    icon: FilePenLine,
    tone: 'text-amber-700',
    iconWrap: 'bg-amber-100 text-amber-700',
  },
  CHANGES_APPROVED: {
    label: 'Edits approved',
    icon: CheckCircle2,
    tone: 'text-emerald-700',
    iconWrap: 'bg-emerald-100 text-emerald-700',
  },
  CHANGES_REJECTED: {
    label: 'Edits rejected',
    icon: AlertCircle,
    tone: 'text-red-700',
    iconWrap: 'bg-red-100 text-red-600',
  },
};

function actorLabel(log: EventActivityLog) {
  const name = log.actorName?.trim();
  if (!name) {
    return log.actorRole === 'ADMIN' ? 'Admin' : log.actorRole === 'HOST' ? 'Host' : null;
  }
  if (log.actorRole === 'ADMIN') return `${name} (Admin)`;
  if (log.actorRole === 'HOST') return `${name} (Host)`;
  return name;
}

function logMessageTitle(log: EventActivityLog) {
  if (log.action === 'REJECTED' || log.action === 'CHANGES_REJECTED') {
    return 'Admin message';
  }
  if (log.action === 'RESUBMITTED' || log.action === 'CHANGES_SUBMITTED') {
    return 'Resubmission comments';
  }
  return 'Message';
}

export function EventActivityLogDialog({
  event,
  open,
  onOpenChange,
}: {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const logs = event?.activityLogs ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-purple-50 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-purple-deep">
            <History className="h-5 w-5" />
            Activity log
          </DialogTitle>
          {event ? (
            <p className="text-sm text-gray-500 pt-1 truncate">{event.title}</p>
          ) : null}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-5">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                No activity has been recorded for this event yet.
              </p>
            ) : (
              <ol className="relative space-y-0">
                {logs.map((log, index) => {
                  const meta = ACTION_META[log.action] ?? ACTION_META.CREATED;
                  const Icon = meta.icon;
                  const who = actorLabel(log);
                  const isLast = index === logs.length - 1;

                  return (
                    <li key={log.id} className="relative flex gap-3 pb-6 last:pb-0">
                      {!isLast ? (
                        <span className="absolute left-[15px] top-8 bottom-0 w-px bg-purple-100" />
                      ) : null}
                      <div
                        className={cn(
                          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          meta.iconWrap,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className={cn('text-sm font-semibold', meta.tone)}>
                          {meta.label}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatAdminDateTime(log.createdAt)}
                        </p>
                        {who ? (
                          <p className="mt-1 text-xs text-gray-600">by {who}</p>
                        ) : null}
                        {log.message ? (
                          <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              {logMessageTitle(log)}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                              {log.message}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
