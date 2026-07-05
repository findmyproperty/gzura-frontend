import MemberCoursesHome from '@/components/member/MemberCoursesHome';
import { getEvents } from '@/lib/events-server';

export default async function MemberHomePage() {
  const events = await getEvents({ fresh: true });
  return <MemberCoursesHome events={events} />;
}