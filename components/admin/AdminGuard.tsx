'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { isAdminAreaRole } from '@/lib/user-roles';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

function AdminLoadingScreen() {
  return <LoadingSpinner light message="Loading Admin Workspace..." />;
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (!isAdminAreaRole(user.role)) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (!user || !isAdminAreaRole(user.role)) {
    return null;
  }

  return <>{children}</>;
}
