'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { isAdminAreaRole } from '@/lib/user-roles';

function AdminLoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center gradient-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #2D0A4E, #4c1d95, #1e0a3c)',
      }}
    >
      <p className="text-white" style={{ color: '#fff' }}>
        Loading...
      </p>
    </div>
  );
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
