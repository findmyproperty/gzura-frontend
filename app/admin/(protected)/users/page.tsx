'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { api, User } from '@/lib/api';
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
  getInitialsFromName,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
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

  return (
    <div className="space-y-6">
      <AdminPageHeader breadcrumb="Admin / User Management" title="User Management" />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users"
        loading={loading}
        filters={
          <>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button className="btn-primary" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add user
          </Button>
        }
      >
        <AdminTable minWidth="900px">
          <AdminTableHead>
            <AdminTableHeaderCell>User</AdminTableHeaderCell>
            <AdminTableHeaderCell>Role</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Joined</AdminTableHeaderCell>
            <AdminTableHeaderCell>Last Sign In</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-12" />
          </AdminTableHead>
          <AdminTableBody>
            {filteredUsers.map((user) => {
              const status = user.status ?? 'ACTIVE';
              const isActive = status === 'ACTIVE';

              return (
                <AdminTableRow
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={cn(
                            getAvatarColor(user.id),
                            'text-white text-sm font-semibold',
                          )}
                        >
                          {getInitialsFromName(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-lg text-gray-400 hover:text-purple-deep hover:bg-gray-100 transition-colors"
                          aria-label="User actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit user
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
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
            {filteredUsers.length === 0 && (
              <AdminEmptyRow colSpan={6} message="No users match your filters" />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-purple-deep">
              {editingId ? 'Edit User' : 'Add User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{editingId ? 'New Password (optional)' : 'Password'}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingId}
                minLength={6}
                placeholder={editingId ? 'Leave blank to keep current' : ''}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="btn-primary">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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