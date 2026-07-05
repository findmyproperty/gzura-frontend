'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { api, Event } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { formatEventPrice, isFreeEventPrice } from '@/lib/price';

export default function EventRegisterPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    profession: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/events/${id}/register`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    api.getEvent(id).then(setEvent).catch(() => router.push('/events')).finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        profession: user.profession || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.registerForEvent({ eventId: id, ...form });
      setSuccess(true);
      toast({
        title: 'Course joined!',
        description: `${event?.title} has been added to your learnings.`,
      });
    } catch (err) {
      toast({
        title: 'Could not join course',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <Loader2 className="w-8 h-8 text-gold-royal animate-spin" />
      </div>
    );
  }

  const isFree = isFreeEventPrice(event?.price);

  if (success) {
    return (
      <section className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-purple-deep mb-2">You&apos;re enrolled!</h1>
          <p className="text-gray-600 mb-6">{event?.title} is now in your courses.</p>
          <div className="flex flex-col gap-3">
            <Link href="/my-learnings">
              <Button className="btn-primary w-full">View My Learnings</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Browse more courses</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="gradient-bg pt-32 pb-8">
        <div className="container-custom max-w-2xl">
          <Link href={`/events/${id}`} className="text-white/70 hover:text-gold-400 text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to course
          </Link>
          <h1 className="text-3xl font-bold text-white">Join {event?.title}</h1>
          <p className="text-white/80 mt-2 text-sm">
            {isFree
              ? 'This course is free — complete enrollment to access it in My Learnings.'
              : 'Complete your enrollment to access this course in My Learnings.'}
          </p>
          {event ? (
            <p className="mt-3 text-lg font-semibold text-gold-royal">
              {formatEventPrice(event.price)}
              {isFree ? ' enrollment' : ''}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-5">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Profession</Label>
                <Input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="btn-secondary w-full">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFree ? (
                'Join for free'
              ) : (
                'Join Course'
              )}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}