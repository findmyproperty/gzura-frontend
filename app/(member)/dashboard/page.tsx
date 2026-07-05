import { redirect } from 'next/navigation';

type Props = {
  searchParams: { tab?: string };
};

export default function DashboardRedirect({ searchParams }: Props) {
  const tab = searchParams.tab;
  redirect(tab ? `/my-learnings?tab=${tab}` : '/my-learnings');
}