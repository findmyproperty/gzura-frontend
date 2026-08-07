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
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AdminPageHeader({
  breadcrumb,
  title,
  subtitle,
}: {
  breadcrumb: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{breadcrumb}</p>
      <h1 className="text-2xl font-bold text-purple-deep mt-1">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-600 mt-2 max-w-3xl">{subtitle}</p> : null}
    </div>
  );
}

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {(onSearchChange || filters || actions) && (
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center gap-3">
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          )}
          {(filters || actions) && (
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              {filters}
              {actions}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading...</div>
      ) : emptyMessage ? (
        <div className="p-12 text-center text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">{children}</div>
      )}

      {!loading && !emptyMessage && footer ? (
        <div className="border-t border-gray-100 px-4 py-3 md:px-5">{footer}</div>
      ) : null}
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
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
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
                    ? 'bg-purple-deep text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
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
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
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
    <table className="w-full text-sm" style={{ minWidth }}>
      {children}
    </table>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-gray-100 text-gray-500">{children}</tr>
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
    <th className={cn('text-left font-medium px-5 py-4', className)}>{children}</th>
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
        'border-b border-gray-50 hover:bg-gray-50/80 transition-colors',
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
    <td className={cn('px-5 py-4', className)} onClick={onClick}>
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
  tone?: 'success' | 'danger' | 'warning' | 'muted';
}) {
  const dotClass = {
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    muted: 'bg-gray-400',
  }[tone];

  const textClass = {
    success: 'text-emerald-600',
    danger: 'text-red-600',
    warning: 'text-amber-600',
    muted: 'text-gray-500',
  }[tone];

  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', dotClass)} />
      <span className={cn('text-sm font-medium', textClass)}>{label}</span>
    </div>
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
        'inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700',
        className,
      )}
    >
      {children}
    </span>
  );
}