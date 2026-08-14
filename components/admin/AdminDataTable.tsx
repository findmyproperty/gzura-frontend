'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Pencil,
  Search,
  X,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const AVATAR_COLORS = [
  'bg-purple-deep',
  'bg-purple-800',
  'bg-purple-700',
  'bg-purple-900',
  'bg-purple-600',
  'bg-purple-800',
  'bg-purple-700',
  'bg-purple-950',
];

export const ADMIN_TABLE_MIN_WIDTH = '960px';

export const adminCol = {
  primary: 'w-[26%]',
  person: 'w-[18%]',
  date: 'w-[13%]',
  type: 'w-[12%]',
  status: 'w-[15%]',
  number: 'w-[11%]',
  actions: 'w-[72px]',
} as const;

export const adminFilterTriggerClass =
  'h-9 w-auto min-w-[118px] gap-2 rounded-lg border-[#E5E7EB] bg-white px-3 py-0 text-[13px] font-medium text-gray-600 shadow-none hover:border-purple-deep hover:text-purple-deep hover:bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-gold-royal data-[state=open]:text-zinc-900';

export const adminActionOutlineClass =
  'h-9 rounded-lg border-[#E5E7EB] bg-white px-3.5 py-0 text-[13px] font-medium text-gray-700 shadow-none hover:border-purple-deep hover:bg-purple-50 hover:text-purple-deep gap-2';

export const adminIconButtonClass =
  'rounded-md p-1 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-deep';

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

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

export function useAdminTablePaging<T>(items: T[], resetKey: string) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, pageSize, setPageSize, totalPages, pagedItems };
}

export function AdminFilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gold-royal px-3 text-[13px] font-medium text-zinc-900 hover:bg-gold-400"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

export async function runAdminBulk(
  ids: string[],
  task: (id: string) => Promise<unknown>,
) {
  const results = await Promise.allSettled(ids.map((id) => task(id)));
  const failed = results.filter((result) => result.status === 'rejected').length;
  return { ok: results.length - failed, failed };
}

export function AdminBulkBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children?: React.ReactNode;
}) {
  if (count <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2">
      <span className="text-[13px] font-semibold text-zinc-900">
        {count} selected
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-[13px] text-gray-400 transition-colors hover:text-purple-deep"
      >
        Clear
      </button>
    </div>
  );
}

export function AdminDataTable({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  bulkBar,
  loading,
  emptyMessage,
  footer,
  fill = true,
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  bulkBar?: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
  fill?: boolean;
  children: React.ReactNode;
}) {
  const searchField = onSearchChange ? (
    <div className="relative w-full min-w-0 sm:w-[228px] sm:shrink-0">
      <Search
        strokeWidth={1.75}
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={search ?? ''}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="box-border h-9 w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-[13px] leading-none text-zinc-900 outline-none placeholder:text-gray-400 focus:border-gold-royal"
      />
    </div>
  ) : null;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-[24px] bg-white font-sans shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        fill ? 'min-h-0 flex-1' : 'h-auto',
      )}
    >
      {(onSearchChange || filters || actions || bulkBar) && (
        <div className="shrink-0 space-y-3 px-5 pb-4 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {filters ? (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {filters}
              </div>
            ) : null}
            {(searchField || actions) ? (
              <div
                className={cn(
                  'flex min-w-0 flex-wrap items-center gap-2',
                  filters && 'sm:ml-auto',
                )}
              >
                {searchField}
                {actions}
              </div>
            ) : null}
          </div>
          {bulkBar}
        </div>
      )}

      <div
        className={cn(
          'scrollbar-none isolate overflow-auto px-4 pb-2',
          fill ? 'min-h-0 flex-1' : 'h-auto',
        )}
      >
        {loading ? (
          <div className="p-16 text-center text-[14px] text-gray-500">Loading...</div>
        ) : emptyMessage ? (
          <div className="p-16 text-center text-[14px] text-gray-500">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>

      {!loading && !emptyMessage && footer ? (
        <div className={cn('shrink-0 px-5 pb-3 pt-3', fill && 'mt-auto')}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function PaginationIconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-deep disabled:pointer-events-none disabled:text-gray-300"
    >
      {children}
    </button>
  );
}

export function AdminTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'items',
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemLabel?: string;
}) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-gray-400">
        Page {page} of {totalPages}
        <span className="sr-only">
          {' '}
          ({start}-{end} of {totalItems} {itemLabel})
        </span>
      </p>

      <div className="flex items-center gap-0.5">
        <PaginationIconButton
          label="First page"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationIconButton>
        <PaginationIconButton
          label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationIconButton>

        <div className="hidden items-center sm:flex">
          {pages.map((p, i) =>
            p === '…' ? (
              <span
                key={`e-${i}`}
                className="inline-flex h-8 w-8 items-center justify-center text-[13px] text-gray-400"
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
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-[13px] transition-colors',
                  p === page
                    ? 'border border-gold-royal bg-gold-50 font-semibold text-zinc-900'
                    : 'font-normal text-gray-400 hover:bg-purple-50 hover:text-purple-deep',
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <span className="px-2 text-[13px] text-gray-400 sm:hidden">
          {page}/{totalPages}
        </span>

        <PaginationIconButton
          label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationIconButton>
        <PaginationIconButton
          label="Last page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationIconButton>
      </div>

      <div className="flex items-center">
        {onPageSizeChange ? (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[92px] rounded-lg border-[#E5E7EB] bg-white px-2 py-0 text-[13px] text-gray-500 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-[13px] text-gray-400">{pageSize} / page</span>
        )}
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
  minWidth = ADMIN_TABLE_MIN_WIDTH,
}: {
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <table
      className="h-auto w-full table-fixed border-collapse text-[14px] leading-5 font-sans"
      style={{ minWidth }}
    >
      <colgroup>
        <col style={{ width: 48 }} />
      </colgroup>
      {children}
    </table>
  );
}

const headerCellClass =
  'bg-[#F4F5F7] text-left text-[12px] font-medium text-gray-400 px-4 py-3 first:pl-4 last:pr-4 first:rounded-tl-xl last:rounded-tr-xl';

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-20">
      <tr className="bg-[#F4F5F7]">{children}</tr>
    </thead>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
  sortable,
}: {
  children?: React.ReactNode;
  className?: string;
  sortable?: boolean;
}) {
  return (
    <th className={cn(headerCellClass, className)}>
      {sortable && children ? (
        <span className="inline-flex items-center gap-1">
          {children}
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </span>
      ) : (
        children
      )}
    </th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="relative z-0">{children}</tbody>;
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
        'hover:bg-[#FAFAFA]',
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
    <td
      className={cn(
        'border-b border-[#F3F4F6] px-4 py-[14px] align-middle first:pl-4 last:pr-4 text-[14px] text-gray-600',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
}

export function AdminTableCheckboxCell({
  checked,
  onCheckedChange,
  ariaLabel,
  header,
}: {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
  header?: boolean;
}) {
  const checkbox = (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      aria-label={ariaLabel}
      className="h-4 w-4 rounded-[4px] border-[#D1D5DB] shadow-none data-[state=checked]:border-gold-royal data-[state=checked]:bg-gold-royal data-[state=checked]:text-zinc-900"
    />
  );

  if (header) {
    return (
      <th
        className={cn(headerCellClass, 'w-12 p-0 text-center align-middle')}
        onClick={(e) => e.stopPropagation()}
      >
        {checkbox}
      </th>
    );
  }

  return (
    <td
      className="w-12 border-b border-[#F3F4F6] p-0 text-center align-middle"
      onClick={(e) => e.stopPropagation()}
    >
      {checkbox}
    </td>
  );
}

export function AdminRowActions({
  onEdit,
  menu,
}: {
  onEdit?: () => void;
  menu?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-end gap-0.5"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {onEdit ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className={adminIconButtonClass}
          aria-label="Edit"
        >
          <Pencil className="h-[18px] w-[18px]" />
        </button>
      ) : null}
      {menu}
    </div>
  );
}

export const AdminMoreButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function AdminMoreButton({ className, onClick, onPointerDown, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="More actions"
      {...props}
      className={cn(adminIconButtonClass, className)}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    >
      <MoreHorizontal className="h-[18px] w-[18px]" />
    </button>
  );
});

export function AdminEmptyRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-16 text-center text-sm text-gray-500">
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
  const textClass = {
    success: 'text-zinc-800',
    danger: 'text-zinc-900',
    muted: 'text-gray-400',
    warning: 'text-purple-deep',
  }[tone];

  const dotClass = {
    success: 'bg-emerald-500',
    danger: 'bg-purple-deep',
    muted: 'bg-gray-300',
    warning: 'bg-purple-deep',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium',
        textClass,
      )}
    >
      <span className={cn('h-2 w-2 shrink-0 rounded-full', dotClass)} />
      {label}
    </span>
  );
}

export function AdminEntityCell({
  media,
  title,
  subtitle,
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {media}
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold leading-5 text-zinc-900">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[12px] leading-4 text-gray-400">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function AdminAvatar({
  id,
  initials,
  className,
}: {
  id: string;
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white',
        getAvatarColor(id),
        className,
      )}
    >
      {initials}
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
        'inline-flex items-center whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-medium text-gray-600',
        className,
      )}
    >
      {children}
    </span>
  );
}
