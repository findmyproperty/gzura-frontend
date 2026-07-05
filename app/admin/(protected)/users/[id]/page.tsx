'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2, Pencil } from 'lucide-react';
import {
  AdminDetailLayout,
  DetailCard,
  DetailField,
} from '@/components/admin/AdminDetailLayout';
import {
  formatAdminDate,
  getAvatarColor,
  getInitialsFromName,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api, User } from '@/lib/api';
import { formatUserRole } from '@/lib/user-roles';
import { cn } from '@/lib/utils';

export default function AdminUserViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getUser(id)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <AdminDetailLayout
        backHref="/admin/users"
        backLabel="Back to users"
        title="User not found"
      >
        <p className="text-gray-500">This user may have been removed.</p>
      </AdminDetailLayout>
    );
  }

  const isActive = (user.status ?? 'ACTIVE') === 'ACTIVE';

  return (
    <AdminDetailLayout
      backHref="/admin/users"
      backLabel="Back to users"
      title={`${user.firstName} ${user.lastName}`}
      subtitle={user.email}
      actions={
        <Button asChild className="btn-primary">
          <Link href={`/admin/users?edit=${user.id}`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit user
          </Link>
        </Button>
      }
    >
      <DetailCard>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback
              className={cn(
                getAvatarColor(user.id),
                'text-white text-xl font-semibold',
              )}
            >
              {getInitialsFromName(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <PillBadge>{formatUserRole(user.role)}</PillBadge>
            <StatusBadge
              label={isActive ? 'Active' : 'Blocked'}
              tone={isActive ? 'success' : 'danger'}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailField label="Email" value={user.email} />
          <DetailField label="Phone" value={user.phone} />
          <DetailField label="City" value={user.city} />
          <DetailField label="Profession" value={user.profession} />
          <DetailField label="Joined" value={formatAdminDate(user.createdAt)} />
          <DetailField label="Last Sign In" value={formatAdminDate(user.lastLoginAt)} />
        </div>
      </DetailCard>
    </AdminDetailLayout>
  );
}