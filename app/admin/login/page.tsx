import { redirect } from 'next/navigation';

export default function AdminLoginRedirect({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.redirect) {
    params.set('redirect', searchParams.redirect);
  }
  const query = params.toString();
  redirect(query ? `/login?${query}` : '/login');
}