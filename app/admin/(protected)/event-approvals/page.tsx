import { redirect } from 'next/navigation';

export default function EventApprovalsRedirect() {
  redirect('/admin/events?status=APPROVAL');
}
