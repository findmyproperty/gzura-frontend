import MemberAreaLayout from '@/components/member/MemberAreaLayout';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MemberAreaLayout>{children}</MemberAreaLayout>;
}