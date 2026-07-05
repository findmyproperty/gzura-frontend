'use client';

import { cn } from '@/lib/utils';

type EventFormCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function EventFormCard({
  icon,
  title,
  children,
  className,
}: EventFormCardProps) {
  return (
    <div
      className={cn(
        'h-full rounded-xl border border-purple-100/80 bg-gradient-to-br from-white to-purple-50/40 p-3.5 sm:p-4',
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-deep/10">
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-deep/70">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}