'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

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
    if (!user) router.replace('/login?redirect=/admin');
    else if (user.role !== 'ADMIN') router.replace('/home');
  }, [user, loading, router]);

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}