'use client';

import { usePathname } from 'next/navigation';
import MemberGuard from '@/components/member/MemberGuard';
import MemberShell from '@/components/member/MemberShell';

function shouldUseMemberShell(pathname: string): boolean {
  if (pathname === '/onboarding') return false;
  if (/\/events\/[^/]+\/meet$/.test(pathname)) return false;
  return true;
}

export default function MemberAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const useShell = shouldUseMemberShell(pathname);

  return (
    <MemberGuard>
      {useShell ? <MemberShell>{children}</MemberShell> : children}
    </MemberGuard>
  );
}