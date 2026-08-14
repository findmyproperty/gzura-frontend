'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { api, CommunityRegistration, CommunityRegistrationStatus } from '@/lib/api';
import {
  formatInterestLabel,
  formatRegistrationStatusLabel,
  getRegistrationStatusTone,
} from '@/lib/registration-labels';
import {
  AdminAvatar,
  AdminBulkBar,
  AdminDataTable,
  AdminEmptyRow,
  AdminEntityCell,
  AdminFilterChip,
  AdminMoreButton,
  AdminPageHeader,
  AdminRowActions,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCheckboxCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTablePagination,
  AdminTableRow,
  ADMIN_TABLE_MIN_WIDTH,
  adminActionOutlineClass,
  adminCol,
  adminFilterTriggerClass,
  runAdminBulk,
  formatAdminDate,
  getInitialsFromFullName,
  PillBadge,
  StatusBadge,
  useAdminTablePaging,
} from '@/components/admin/AdminDataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminExportMenu } from '@/components/admin/AdminExportMenu';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<CommunityRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    api
      .getCommunityRegistrations()
      .then(setRows)
      .catch((err) => {
        setRows([]);
        toast({
          title: 'Failed to load host requests',
          description: err instanceof Error ? err.message : 'Request failed',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (
    id: string,
    status: Exclude<CommunityRegistrationStatus, 'pending'>,
    fullName: string,
  ) => {
    setUpdatingId(id);
    try {
      const updated = await api.updateCommunityRegistration(id, { status });
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      toast({
        title: status === 'approved' ? 'Request approved' : 'Request rejected',
        description:
          status === 'approved'
            ? `${fullName} is now listed in Users as a host.`
            : `${fullName}'s host request has been rejected.`,
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

  const handleBulkStatus = async (
    status: Exclude<CommunityRegistrationStatus, 'pending'>,
  ) => {
    if (selectedIds.length === 0) return;
    setBulkBusy(true);
    try {
      const { ok, failed } = await runAdminBulk(selectedIds, (id) =>
        api.updateCommunityRegistration(id, { status }),
      );
      toast({
        title: failed
          ? `Updated ${ok}, ${failed} failed`
          : `${status === 'approved' ? 'Approved' : 'Rejected'} ${ok} request${ok === 1 ? '' : 's'}`,
        variant: failed ? 'destructive' : 'default',
      });
      setSelectedIds([]);
      const latest = await api.getCommunityRegistrations();
      setRows(latest);
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Request failed',
        variant: 'destructive',
      });
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Delete ${selectedIds.length} selected request${selectedIds.length === 1 ? '' : 's'}?`,
      )
    ) {
      return;
    }
    setBulkBusy(true);
    try {
      const { ok, failed } = await runAdminBulk(selectedIds, (id) =>
        api.deleteCommunityRegistration(id),
      );
      toast({
        title: failed ? `Deleted ${ok}, ${failed} failed` : `Deleted ${ok} request${ok === 1 ? '' : 's'}`,
        variant: failed ? 'destructive' : 'default',
      });
      setSelectedIds([]);
      setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    } finally {
      setBulkBusy(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete request from "${name}"?`)) return;
    try {
      await api.deleteCommunityRegistration(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast({ title: 'Request deleted' });
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Request failed',
        variant: 'destructive',
      });
    }
  };

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === 'all' || row.status === statusFilter;

      if (!query) return matchesStatus;

      return (
        matchesStatus &&
        (row.fullName.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          (row.profession || '').toLowerCase().includes(query) ||
          formatInterestLabel(row.interest).toLowerCase().includes(query) ||
          (row.message || '').toLowerCase().includes(query))
      );
    });
  }, [rows, search, statusFilter]);

  const { page, setPage, pageSize, setPageSize, totalPages, pagedItems } =
    useAdminTablePaging(filteredRows, `${search}|${statusFilter}`);

  const pageIds = pagedItems.map((row) => row.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id));

  const exportRows = filteredRows.map((reg) => ({
    kind: 'community' as const,
    ...reg,
  }));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <AdminPageHeader
        breadcrumb="Admin / Host Requests"
        title="Host Registration Requests"
      />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search host requests."
        loading={loading}
        filters={
          <>
            {statusFilter !== 'all' ? (
              <AdminFilterChip
                label={formatRegistrationStatusLabel(statusFilter as CommunityRegistrationStatus)}
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
        actions={<AdminExportMenu rows={exportRows} disabled={loading} />}
        bulkBar={
          <AdminBulkBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
            <Select
              key={selectedIds.join(',')}
              disabled={bulkBusy}
              onValueChange={(value) =>
                void handleBulkStatus(value as Exclude<CommunityRegistrationStatus, 'pending'>)
              }
            >
              <SelectTrigger className={adminFilterTriggerClass}>
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Set Approved</SelectItem>
                <SelectItem value="rejected">Set Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className={cn(
                adminActionOutlineClass,
                'text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700',
              )}
              disabled={bulkBusy}
              onClick={() => void handleBulkDelete()}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AdminBulkBar>
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
              ariaLabel="Select all requests on this page"
            />
            <AdminTableHeaderCell className={adminCol.primary} sortable>Applicant</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.type}>Course Interest</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.person}>Profession</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.status}>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.date}>Submitted</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-[16%]">Actions</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {pagedItems.map((row) => (
              <AdminTableRow
                key={row.id}
                onClick={() =>
                  router.push(`/admin/registrations/${row.id}?type=community`)
                }
              >
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
                    subtitle={row.email}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <PillBadge>
                    {formatInterestLabel(row.interest)}
                  </PillBadge>
                </AdminTableCell>
                <AdminTableCell className="text-gray-600">
                  {row.profession || '—'}
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge
                    label={formatRegistrationStatusLabel(row.status)}
                    tone={getRegistrationStatusTone(row.status)}
                  />
                </AdminTableCell>
                <AdminTableCell className="text-gray-500 whitespace-nowrap">
                  {formatAdminDate(row.createdAt)}
                </AdminTableCell>
                <AdminTableCell
                  className="whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-2">
                    {row.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          className="btn-admin h-8"
                          disabled={updatingId === row.id}
                          onClick={() => updateStatus(row.id, 'approved', row.fullName)}
                        >
                          {updatingId === row.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          disabled={updatingId === row.id}
                          onClick={() => updateStatus(row.id, 'rejected', row.fullName)}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <AdminRowActions
                      menu={
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <AdminMoreButton />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/registrations/${row.id}?type=community`)
                              }
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => void handleDelete(row.id, row.fullName)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {filteredRows.length === 0 && (
              <AdminEmptyRow
                colSpan={7}
                message="No host registration requests match your search"
              />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>
    </div>
  );
}