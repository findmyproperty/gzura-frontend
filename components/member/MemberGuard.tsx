'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { isMemberAreaRole } from '@/lib/user-roles';
import { isOnboardingComplete } from '@/lib/member-onboarding';

export default function MemberGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role === 'ADMIN') {
      router.replace('/admin');
      return;
    }

    if (
      user.role === 'MEMBER' &&
      pathname !== '/onboarding' &&
      !isOnboardingComplete(user)
    ) {
      router.replace('/onboarding');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !isMemberAreaRole(user.role)) {
    return null;
  }

  return <>{children}</>;
}