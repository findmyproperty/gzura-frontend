'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import {
  AdminAvatar,
  AdminDataTable,
  AdminEmptyRow,
  AdminEntityCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCheckboxCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTablePagination,
  AdminTableRow,
  ADMIN_TABLE_MIN_WIDTH,
  adminCol,
  getInitialsFromFullName,
  PillBadge,
  StatusBadge,
  useAdminTablePaging,
} from '@/components/admin/AdminDataTable';
import { api, Event, EventRegistration } from '@/lib/api';

function formatEnrolledAt(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventEnrolledUsers({ event }: { event: Event }) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .getRegistrations(event.id)
      .then(setRegistrations)
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, [event.id]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;

    return registrations.filter((row) => {
      const haystack = [
        row.fullName,
        row.email,
        row.phone,
        row.city,
        row.profession,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [registrations, search]);

  const { page, setPage, pageSize, setPageSize, totalPages, pagedItems } =
    useAdminTablePaging(filtered, search);

  const pageIds = pagedItems.map((row) => row.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id));

  const isOffline = event.type === 'Offline';
  const colSpan = (isOffline ? 7 : 5) + 1;

  return (
    <AdminDataTable
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search enrolled users."
      loading={loading}
      emptyMessage={
        registrations.length === 0
          ? 'No one has enrolled in this event yet.'
          : undefined
      }
      footer={
        filtered.length > 0 ? (
          <AdminTablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            itemLabel="enrolled"
          />
        ) : null
      }
    >
      <AdminTable minWidth={ADMIN_TABLE_MIN_WIDTH}>
        <AdminTableHead>
          <AdminTableCheckboxCell
            header
            checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
            onCheckedChange={(checked) => {
              setSelectedIds((prev) =>
                checked
                  ? Array.from(new Set([...prev, ...pageIds]))
                  : prev.filter((id) => !pageIds.includes(id)),
              );
            }}
            ariaLabel="Select all enrolled users on this page"
          />
          <AdminTableHeaderCell className={adminCol.primary} sortable>Attendee</AdminTableHeaderCell>
          <AdminTableHeaderCell className={adminCol.person}>Contact</AdminTableHeaderCell>
          <AdminTableHeaderCell className={adminCol.date}>Location</AdminTableHeaderCell>
          <AdminTableHeaderCell className={adminCol.date}>Enrolled</AdminTableHeaderCell>
          <AdminTableHeaderCell className={adminCol.type}>Payment</AdminTableHeaderCell>
          {isOffline ? <AdminTableHeaderCell className={adminCol.status}>Check-in</AdminTableHeaderCell> : null}
          {isOffline ? <AdminTableHeaderCell className={adminCol.actions}>Pass</AdminTableHeaderCell> : null}
        </AdminTableHead>
        <AdminTableBody>
          {filtered.length === 0 ? (
            <AdminEmptyRow
              colSpan={colSpan}
              message={
                registrations.length === 0
                  ? 'No enrolled users yet.'
                  : 'No users match your search.'
              }
            />
          ) : (
            pagedItems.map((row) => (
              <AdminTableRow key={row.id}>
                <AdminTableCheckboxCell
                  checked={selectedIds.includes(row.id)}
                  onCheckedChange={(checked) => {
                    setSelectedIds((prev) =>
                      checked ? [...prev, row.id] : prev.filter((id) => id !== row.id),
                    );
                  }}
                  ariaLabel={`Select ${row.fullName}`}
                />
                <AdminTableCell>
                  <AdminEntityCell
                    media={
                      <AdminAvatar
                        id={row.id}
                        initials={getInitialsFromFullName(row.fullName)}
                      />
                    }
                    title={row.fullName}
                    subtitle={row.profession}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <p className="text-gray-900">{row.email}</p>
                  <p className="text-xs text-gray-500">{row.phone || '—'}</p>
                </AdminTableCell>
                <AdminTableCell>{row.city || '—'}</AdminTableCell>
                <AdminTableCell className="text-gray-600 whitespace-nowrap">
                  {formatEnrolledAt(row.createdAt)}
                </AdminTableCell>
                <AdminTableCell>
                  {row.paymentStatus === 'PAID' ? (
                    <PillBadge>
                      Paid{row.amountPaid ? ` · ₹${row.amountPaid}` : ''}
                    </PillBadge>
                  ) : (
                    <PillBadge>Free</PillBadge>
                  )}
                </AdminTableCell>
                {isOffline ? (
                  <AdminTableCell>
                    {row.checkedInAt ? (
                      <StatusBadge label="Checked in" tone="success" />
                    ) : (
                      <StatusBadge label="Not checked in" tone="muted" />
                    )}
                  </AdminTableCell>
                ) : null}
                {isOffline ? (
                  <AdminTableCell>
                    {row.passUrl ? (
                      <Link
                        href={row.passUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
                      >
                        View pass
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      '—'
                    )}
                  </AdminTableCell>
                ) : null}
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </AdminDataTable>
  );
}
