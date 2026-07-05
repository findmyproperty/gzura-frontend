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
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
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
    </div>
  );
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
  tone?: 'success' | 'danger' | 'muted';
}) {
  const dotClass = {
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    muted: 'bg-gray-400',
  }[tone];

  const textClass = {
    success: 'text-emerald-600',
    danger: 'text-red-600',
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