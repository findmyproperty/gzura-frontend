'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const AVATAR_COLORS = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-teal-600',
];

export function getAvatarColor(id: string) {
  const index = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getInitialsFromName(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
}

export function getInitialsFromFullName(fullName?: string) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function formatAdminDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

export function formatAdminDateTime(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

export { AdminPageHeader } from '@/components/admin/admin-chrome';

export function AdminDataTable({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  loading,
  emptyMessage,
  footer,
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {(onSearchChange || filters || actions) && (
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
          {onSearchChange && (
            <div className="relative flex h-10 w-full max-w-sm items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400" />
              <Input
                value={search ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-full border-gray-200 bg-white py-0 pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-purple-200 focus-visible:ring-offset-0"
              />
            </div>
          )}
          {(filters || actions) && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {filters}
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-purple-100/70 bg-white">
        <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : emptyMessage ? (
            <div className="p-12 text-center text-gray-500">{emptyMessage}</div>
          ) : (
            children
          )}
        </div>

        {!loading && !emptyMessage && footer ? (
          <div className="shrink-0 border-t border-gray-100 px-5 py-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/** Compact page controls for admin list tables */
export function AdminTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'items',
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-medium text-gray-700">
          {start}–{end}
        </span>{' '}
        of <span className="font-medium text-gray-700">{totalItems}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, i) =>
            p === '…' ? (
              <span
                key={`e-${i}`}
                className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-zinc-900 text-white rounded-full'
                    : 'text-gray-600 hover:bg-gray-100 rounded-full'
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <span className="px-2 text-sm text-gray-500 sm:hidden">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function getPaginationRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, '…', total];
  }

  if (current >= total - 2) {
    return [1, '…', total - 3, total - 2, total - 1, total];
  }

  return [1, '…', current - 1, current, current + 1, '…', total];
}

export function AdminTable({
  children,
  minWidth = '720px',
}: {
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <table className="w-full table-fixed text-sm" style={{ minWidth }}>
      {children}
    </table>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-gray-100 bg-[#F8F6FB] text-[11px] uppercase tracking-wider text-gray-400">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn('text-left font-medium px-4 py-3.5 first:pl-5 last:pr-5', className)}>{children}</th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function AdminTableRow({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-gray-100 last:border-0 hover:bg-[#F8F6FB] transition-colors',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLTableCellElement>;
}) {
  return (
    <td className={cn('px-4 py-5 align-middle first:pl-5 last:pr-5', className)} onClick={onClick}>
      {children}
    </td>
  );
}

export function AdminEmptyRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-gray-500">
        {message}
      </td>
    </tr>
  );
}

export function StatusBadge({
  label,
  tone = 'success',
}: {
  label: string;
  tone?: 'success' | 'danger' | 'muted' | 'warning';
}) {
  const wrapClass = {
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-red-50 text-red-700',
    muted: 'bg-gray-100 text-gray-600',
    warning: 'bg-amber-50 text-amber-700',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        wrapClass,
      )}
    >
      {label}
    </span>
  );
}

export function PillBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600',
        className,
      )}
    >
      {children}
    </span>
  );
}