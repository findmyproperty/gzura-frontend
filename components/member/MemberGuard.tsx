'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { isMemberAreaRole } from '@/lib/user-roles';
import { isOnboardingComplete } from '@/lib/member-onboarding';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

    if (user.role === 'ADMIN' || user.role === 'HOST') {
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
    return <LoadingSpinner message="Preparing your experience..." />;
  }

  if (!user || !isMemberAreaRole(user.role)) {
    return null;
  }

  return <>{children}</>;
}