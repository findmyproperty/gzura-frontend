'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EventFormCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
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

/** Full-width form section with numbered title and clear visual separation */
type EventFormSectionProps = {
  step: number;
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
};

export function EventFormSection({
  step,
  title,
  description,
  badge,
  children,
  className,
}: EventFormSectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-purple-100/90 bg-white shadow-sm shadow-purple-900/[0.04]',
        className,
      )}
    >
      {/* Gold–purple top accent bar */}
      <div
        className="h-1 w-full bg-gradient-to-r from-purple-deep via-purple-500 to-gold-400"
        aria-hidden
      />

      <div className="p-5 sm:p-6 md:p-7">
        <header className="mb-6 flex flex-col gap-3 border-b border-purple-50 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5 min-w-0">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 text-sm font-bold text-white shadow-md shadow-purple-900/20"
              aria-hidden
            >
              {String(step).padStart(2, '0')}
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-lg font-bold tracking-tight text-purple-deep sm:text-xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {badge ? (
            <span className="inline-flex shrink-0 items-center self-start rounded-full bg-purple-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-deep/70 ring-1 ring-purple-100">
              {badge}
            </span>
          ) : null}
        </header>

        <div className="space-y-5">{children}</div>
      </div>
    </section>
  );
}