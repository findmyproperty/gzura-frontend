'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { api, RoleRequest, RoleRequestStatus } from '@/lib/api';
import { formatRegistrationStatusLabel, getRegistrationStatusTone } from '@/lib/registration-labels';
import {
  AdminAvatar,
  AdminDataTable,
  AdminEmptyRow,
  AdminEntityCell,
  AdminFilterChip,
  AdminPageHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTablePagination,
  AdminTableRow,
  ADMIN_TABLE_MIN_WIDTH,
  adminCol,
  adminFilterTriggerClass,
  formatAdminDate,
  getInitialsFromFullName,
  StatusBadge,
  useAdminTablePaging,
} from '@/components/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function AdminRoleRequestsPage() {
  const [rows, setRows] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRows = () => {
    setLoading(true);
    api
      .getRoleRequests()
      .then(setRows)
      .catch((err) => {
        setRows([]);
        toast({
          title: 'Failed to load role requests',
          description: err instanceof Error ? err.message : 'Request failed',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRows();
  }, []);

  const applicantName = (row: RoleRequest) =>
    `${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() ||
    row.user?.email ||
    'Member';

  const updateStatus = async (id: string, status: 'approved' | 'rejected', name: string) => {
    setUpdatingId(id);
    try {
      const updated =
        status === 'approved'
          ? await api.approveRoleRequest(id)
          : await api.rejectRoleRequest(id);
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      toast({
        title: status === 'approved' ? 'Request approved' : 'Request rejected',
        description:
          status === 'approved'
            ? `${name} is now a host. They will enter the host workspace on their next session refresh.`
            : `${name}'s host request was rejected.`,
      });
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Request failed',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      if (!query) return matchesStatus;
      const name = applicantName(row).toLowerCase();
      const email = (row.user?.email || '').toLowerCase();
      const message = (row.message || '').toLowerCase();
      return matchesStatus && (name.includes(query) || email.includes(query) || message.includes(query));
    });
  }, [rows, search, statusFilter]);

  const { page, setPage, pageSize, setPageSize, totalPages, pagedItems } =
    useAdminTablePaging(filteredRows, `${search}|${statusFilter}`);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <AdminPageHeader
        breadcrumb="Admin / Role Requests"
        title="Member host requests"
      />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search members."
        loading={loading}
        filtersActive={statusFilter !== 'all'}
        filters={
          <>
            {statusFilter !== 'all' ? (
              <AdminFilterChip
                label={formatRegistrationStatusLabel(statusFilter as RoleRequestStatus)}
                onClear={() => setStatusFilter('all')}
              />
            ) : null}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={adminFilterTriggerClass}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        footer={
          filteredRows.length > 0 ? (
            <AdminTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredRows.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="requests"
            />
          ) : null
        }
      >
        <AdminTable minWidth={ADMIN_TABLE_MIN_WIDTH}>
          <AdminTableHead>
            <AdminTableHeaderCell className={adminCol.primary}>Member</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.type}>Message</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.status}>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.date}>Submitted</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-[72px] text-right md:w-[200px]">
              Actions
            </AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {pagedItems.map((row) => {
              const name = applicantName(row);
              const busy = updatingId === row.id;
              return (
                <AdminTableRow key={row.id}>
                  <AdminTableCell className={adminCol.primary}>
                    <AdminEntityCell
                      media={
                        <AdminAvatar
                          id={row.id}
                          initials={getInitialsFromFullName(name)}
                        />
                      }
                      title={name}
                      subtitle={row.user?.email}
                    />
                  </AdminTableCell>
                  <AdminTableCell className={adminCol.type}>
                    <span className="line-clamp-2 text-sm text-gray-600">
                      {row.message || '—'}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell className={adminCol.status}>
                    <StatusBadge
                      label={formatRegistrationStatusLabel(row.status)}
                      tone={getRegistrationStatusTone(row.status)}
                    />
                  </AdminTableCell>
                  <AdminTableCell className={adminCol.date}>
                    {formatAdminDate(row.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell className="text-right">
                    {row.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="btn-admin h-8"
                          disabled={busy}
                          onClick={() => void updateStatus(row.id, 'approved', name)}
                        >
                          {busy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-1 h-3.5 w-3.5" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={busy}
                          onClick={() => void updateStatus(row.id, 'rejected', name)}
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Reviewed</span>
                    )}
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
            {!loading && pagedItems.length === 0 ? (
              <AdminEmptyRow
                colSpan={5}
                message="No member host requests match your search"
              />
            ) : null}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>
    </div>
  );
}
