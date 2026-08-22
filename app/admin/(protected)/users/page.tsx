'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { api, User } from '@/lib/api';
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
  adminActionLabelClass,
  adminActionOutlineClass,
  adminCol,
  adminFilterTriggerClass,
  adminMobileIconActionClass,
  runAdminBulk,
  formatAdminDate,
  getInitialsFromName,
  PillBadge,
  StatusBadge,
  useAdminTablePaging,
} from '@/components/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  formatUserRole,
  USER_ROLE_OPTIONS,
  type UserRole,
} from '@/lib/user-roles';

const emptyForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  profession: '',
  role: 'MEMBER' as UserRole,
  status: 'ACTIVE' as 'ACTIVE' | 'BLOCKED',
};

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    api
      .getUsers()
      .then(setUsers)
      .catch((err) =>
        toast({
          title: 'Failed to load users',
          description: err instanceof Error ? err.message : 'Request failed',
          variant: 'destructive',
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId || users.length === 0) return;
    const user = users.find((item) => item.id === editId);
    if (user) {
      openEdit(user);
      router.replace('/admin/users');
    }
  }, [searchParams, users, router]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const status = user.status ?? 'ACTIVE';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const { page, setPage, pageSize, setPageSize, totalPages, pagedItems } =
    useAdminTablePaging(filteredUsers, `${search}|${roleFilter}|${statusFilter}`);

  const pageIds = pagedItems.map((user) => user.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowPassword(false);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      city: user.city || '',
      profession: user.profession || '',
      role: user.role,
      status: user.status ?? 'ACTIVE',
    });
    setShowPassword(false);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        city: form.city.trim() || undefined,
        profession: form.profession.trim() || undefined,
        role: form.role,
        status: form.status,
      };

      if (editingId) {
        const updatePayload: Record<string, unknown> = { ...payload };
        if (form.password.trim()) {
          updatePayload.password = form.password;
        }
        await api.updateUser(editingId, updatePayload);
        toast({ title: 'User updated' });
      } else {
        if (!form.password.trim()) {
          toast({
            title: 'Password required',
            description: 'Please enter a password for the new user.',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
        await api.createUser({ ...payload, password: form.password });
        toast({ title: 'User created' });
      }

      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      loadUsers();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await api.deleteUser(id);
      toast({ title: 'User deleted' });
      loadUsers();
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Could not delete user',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (user: User) => {
    const next = (user.status ?? 'ACTIVE') === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await api.updateUser(user.id, { status: next });
      toast({ title: next === 'BLOCKED' ? 'User blocked' : 'User activated' });
      loadUsers();
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Could not update status',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatus = async (status: 'ACTIVE' | 'BLOCKED') => {
    if (selectedIds.length === 0) return;
    setBulkBusy(true);
    try {
      const { ok, failed } = await runAdminBulk(selectedIds, (id) =>
        api.updateUser(id, { status }),
      );
      toast({
        title: failed ? `Updated ${ok}, ${failed} failed` : `Updated ${ok} user${ok === 1 ? '' : 's'}`,
        variant: failed ? 'destructive' : 'default',
      });
      setSelectedIds([]);
      loadUsers();
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected user${selectedIds.length === 1 ? '' : 's'}?`)) {
      return;
    }
    setBulkBusy(true);
    try {
      const { ok, failed } = await runAdminBulk(selectedIds, (id) => api.deleteUser(id));
      toast({
        title: failed ? `Deleted ${ok}, ${failed} failed` : `Deleted ${ok} user${ok === 1 ? '' : 's'}`,
        variant: failed ? 'destructive' : 'default',
      });
      setSelectedIds([]);
      loadUsers();
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <AdminPageHeader breadcrumb="Admin / User Management" title="User Management" />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users."
        loading={loading}
        filtersActive={roleFilter !== 'all' || statusFilter !== 'all'}
        filters={
          <>
            {roleFilter !== 'all' ? (
              <AdminFilterChip
                label={formatUserRole(roleFilter as UserRole)}
                onClear={() => setRoleFilter('all')}
              />
            ) : null}
            {statusFilter !== 'all' ? (
              <AdminFilterChip
                label={statusFilter === 'ACTIVE' ? 'Active' : 'Blocked'}
                onClear={() => setStatusFilter('all')}
              />
            ) : null}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className={adminFilterTriggerClass}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Role</SelectItem>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={adminFilterTriggerClass}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button className={cn('btn-admin', adminMobileIconActionClass)} onClick={openCreate}>
            <Plus className="h-4 w-4" />
            <span className={adminActionLabelClass}>Add new user</span>
          </Button>
        }
        bulkBar={
          <AdminBulkBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
            <Select
              key={selectedIds.join(',')}
              disabled={bulkBusy}
              onValueChange={(value) => void handleBulkStatus(value as 'ACTIVE' | 'BLOCKED')}
            >
              <SelectTrigger className={adminFilterTriggerClass}>
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Set Active</SelectItem>
                <SelectItem value="BLOCKED">Set Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className={cn(adminActionOutlineClass, 'text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700')}
              disabled={bulkBusy}
              onClick={() => void handleBulkDelete()}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AdminBulkBar>
        }
        footer={
          filteredUsers.length > 0 ? (
            <AdminTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="users"
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
              ariaLabel="Select all users on this page"
            />
            <AdminTableHeaderCell className="w-[28%]" sortable>User</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.type}>Role</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.status}>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.date}>Joined</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.date}>Last Sign In</AdminTableHeaderCell>
            <AdminTableHeaderCell className={adminCol.actions} />
          </AdminTableHead>
          <AdminTableBody>
            {pagedItems.map((user) => {
              const status = user.status ?? 'ACTIVE';
              const isActive = status === 'ACTIVE';

              return (
                <AdminTableRow
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <AdminTableCheckboxCell
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={(checked) => {
                      setSelectedIds((prev) =>
                        checked ? [...prev, user.id] : prev.filter((id) => id !== user.id),
                      );
                    }}
                    ariaLabel={`Select ${user.firstName} ${user.lastName}`}
                  />
                  <AdminTableCell>
                    <AdminEntityCell
                      media={
                        <AdminAvatar
                          id={user.id}
                          initials={getInitialsFromName(user.firstName, user.lastName)}
                        />
                      }
                      title={`${user.firstName} ${user.lastName}`}
                      subtitle={user.email}
                    />
                  </AdminTableCell>
                  <AdminTableCell>
                    <PillBadge>{formatUserRole(user.role)}</PillBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <StatusBadge
                      label={isActive ? 'Active' : 'Blocked'}
                      tone={isActive ? 'success' : 'danger'}
                    />
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-600 whitespace-nowrap">
                    {formatAdminDate(user.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell className="text-gray-500 whitespace-nowrap">
                    {formatAdminDate(user.lastLoginAt)}
                  </AdminTableCell>
                  <AdminTableCell
                    className="px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AdminRowActions
                      menu={
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <AdminMoreButton />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openEdit(user)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(user)}>
                              {isActive ? 'Block user' : 'Activate user'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() =>
                                handleDelete(user.id, `${user.firstName} ${user.lastName}`)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
            {filteredUsers.length === 0 && (
              <AdminEmptyRow colSpan={7} message="No users match your filters" />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 border-b border-gray-100 px-5 py-4 pr-12 text-left">
            <DialogTitle className="text-purple-deep">
              {editingId ? 'Edit User' : 'Add User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>{editingId ? 'New Password (optional)' : 'Password'}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editingId}
                    minLength={6}
                    placeholder={editingId ? 'Leave blank to keep current' : ''}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) =>
                      setForm({ ...form, role: v as UserRole })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as 'ACTIVE' | 'BLOCKED' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-3 sm:flex-row sm:justify-end sm:gap-3">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  'Save changes'
                ) : (
                  'Add user'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
