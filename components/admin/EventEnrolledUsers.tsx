'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import {
  AdminDataTable,
  AdminEmptyRow,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  getAvatarColor,
  getInitialsFromFullName,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  const isOffline = event.type === 'Offline';

  return (
    <AdminDataTable
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search enrolled users..."
      loading={loading}
      emptyMessage={
        registrations.length === 0
          ? 'No one has enrolled in this event yet.'
          : undefined
      }
    >
      <AdminTable minWidth="900px">
        <AdminTableHead>
          <AdminTableHeaderCell>Attendee</AdminTableHeaderCell>
          <AdminTableHeaderCell>Contact</AdminTableHeaderCell>
          <AdminTableHeaderCell>Location</AdminTableHeaderCell>
          <AdminTableHeaderCell>Enrolled</AdminTableHeaderCell>
          <AdminTableHeaderCell>Payment</AdminTableHeaderCell>
          {isOffline ? <AdminTableHeaderCell>Check-in</AdminTableHeaderCell> : null}
          {isOffline ? <AdminTableHeaderCell>Pass</AdminTableHeaderCell> : null}
        </AdminTableHead>
        <AdminTableBody>
          {loading ? (
            <AdminEmptyRow colSpan={isOffline ? 7 : 5} message="Loading enrolled users..." />
          ) : filtered.length === 0 ? (
            <AdminEmptyRow
              colSpan={isOffline ? 7 : 5}
              message={
                registrations.length === 0
                  ? 'No enrolled users yet.'
                  : 'No users match your search.'
              }
            />
          ) : (
            filtered.map((row) => (
              <AdminTableRow key={row.id}>
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={`${getAvatarColor(row.id)} text-white text-xs font-semibold`}
                      >
                        {getInitialsFromFullName(row.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{row.fullName}</p>
                      {row.profession ? (
                        <p className="text-xs text-gray-500">{row.profession}</p>
                      ) : null}
                    </div>
                  </div>
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
                    <PillBadge className="bg-emerald-50 text-emerald-700">
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
                        className="inline-flex items-center gap-1 text-sm font-medium text-purple-deep hover:text-gold-royal"
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

      {!loading && registrations.length > 0 ? (
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          {filtered.length} of {registrations.length} enrolled
          {event.maxAttendees
            ? ` · ${event.maxAttendees - registrations.length} seats remaining`
            : ''}
        </div>
      ) : null}
    </AdminDataTable>
  );
}