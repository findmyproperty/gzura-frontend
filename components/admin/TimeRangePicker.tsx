'use client';

import { useMemo } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventFormCard } from '@/components/admin/EventFormCard';
import {
  formatTimeLabel,
  generateTimeOptions,
  parseTimeLabel,
  to12HourLabel,
} from '@/lib/time-range';
import { cn } from '@/lib/utils';

type TimeRangePickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'card' | 'bare';
};

const TIME_OPTIONS = generateTimeOptions(30);

export default function TimeRangePicker({
  value,
  onChange,
  className,
  variant = 'card',
}: TimeRangePickerProps) {
  const { start, end } = useMemo(() => parseTimeLabel(value), [value]);

  const updateRange = (nextStart: string, nextEnd: string) => {
    onChange(formatTimeLabel(nextStart, nextEnd));
  };

  const fieldClass = (filled: boolean) =>
    cn(
      'h-11 w-full min-w-0 border-purple-100 bg-white/90 text-left text-sm shadow-sm transition-all',
      'focus:ring-purple-deep/20 focus:border-purple-300 [&>span]:truncate',
      filled && 'border-purple-200 ring-1 ring-purple-100',
    );

  const content = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] sm:items-end">
      <div className="min-w-0 space-y-1">
        <span className="text-[11px] font-medium text-gray-500">Start</span>
        <Select
          value={start || undefined}
          onValueChange={(nextStart) => updateRange(nextStart, end)}
        >
          <SelectTrigger className={fieldClass(!!start)}>
            <SelectValue placeholder="Start time" />
          </SelectTrigger>
          <SelectContent className="max-h-60 border-purple-100">
            {TIME_OPTIONS.map((time) => (
              <SelectItem
                key={`start-${time}`}
                value={time}
                className="focus:bg-purple-50 focus:text-purple-deep"
              >
                {to12HourLabel(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden items-center justify-center sm:flex sm:h-11">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-royal/20 to-gold-400/10">
          <ArrowRight className="h-3.5 w-3.5 text-gold-600" />
        </div>
      </div>

      <div className="min-w-0 space-y-1">
        <span className="text-[11px] font-medium text-gray-500">End</span>
        <Select
          value={end || undefined}
          onValueChange={(nextEnd) => updateRange(start, nextEnd)}
        >
          <SelectTrigger className={fieldClass(!!end)}>
            <SelectValue placeholder="End time" />
          </SelectTrigger>
          <SelectContent className="max-h-60 border-purple-100">
            {TIME_OPTIONS.map((time) => (
              <SelectItem
                key={`end-${time}`}
                value={time}
                className="focus:bg-purple-50 focus:text-purple-deep"
              >
                {to12HourLabel(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (variant === 'bare') {
    return (
      <div className={cn('space-y-3', className)}>
        {content}
        {value ? (
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-purple-deep/5 px-3 py-1 text-xs font-medium text-purple-deep">
            <Clock className="h-3 w-3 shrink-0 text-gold-500" />
            <span className="truncate">{value}</span>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400">Select start and end times</p>
        )}
      </div>
    );
  }

  return (
    <EventFormCard
      icon={<Clock className="h-3.5 w-3.5 text-purple-deep" />}
      title="Schedule"
      className={className}
    >
      {content}
      {value ? (
        <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-purple-deep/5 px-3 py-1 text-xs font-medium text-purple-deep">
          <Clock className="h-3 w-3 shrink-0 text-gold-500" />
          <span className="truncate">{value}</span>
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-gray-400">Select start and end times</p>
      )}
    </EventFormCard>
  );
}
