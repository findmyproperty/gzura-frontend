'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import { api, CommunityRegistration, CommunityRegistrationStatus } from '@/lib/api';
import {
  formatInterestLabel,
  formatRegistrationStatusLabel,
  getRegistrationStatusTone,
} from '@/lib/registration-labels';
import {
  AdminDataTable,
  AdminEmptyRow,
  AdminPageHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  formatAdminDate,
  getAvatarColor,
  getInitialsFromFullName,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
            ? `${fullName} is now listed in Users as an instructor.`
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

  const exportRows = filteredRows.map((reg) => ({
    kind: 'community' as const,
    ...reg,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumb="Admin / Host Requests"
        title="Host Registration Requests"
        subtitle="Prospective course hosts interested in teaching on GZURA. Course enrollments are managed under member My Learnings."
      />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search host requests"
        loading={loading}
        actions={
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <AdminExportMenu rows={exportRows} disabled={loading} />
          </div>
        }
      >
        <AdminTable minWidth="1100px">
          <AdminTableHead>
            <AdminTableHeaderCell>Applicant</AdminTableHeaderCell>
            <AdminTableHeaderCell>Course Interest</AdminTableHeaderCell>
            <AdminTableHeaderCell>Profession</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Submitted</AdminTableHeaderCell>
            <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {filteredRows.map((row) => (
              <AdminTableRow
                key={row.id}
                onClick={() =>
                  router.push(`/admin/registrations/${row.id}?type=community`)
                }
              >
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={cn(
                          getAvatarColor(row.id),
                          'text-white text-sm font-semibold',
                        )}
                      >
                        {getInitialsFromFullName(row.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {row.fullName}
                      </p>
                      <p className="text-gray-500 text-xs truncate">{row.email}</p>
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <PillBadge className="bg-gold-100 text-gold-800 border-gold-200">
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
                  {row.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
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
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {filteredRows.length === 0 && (
              <AdminEmptyRow
                colSpan={6}
                message="No host registration requests match your search"
              />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>
    </div>
  );
}