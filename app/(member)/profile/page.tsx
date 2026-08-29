'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/providers/AuthProvider';
import { MobileNumberLink } from '@/components/auth/MobileNumberLink';
import { api, RoleRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function MemberProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, login, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    city: user?.city || '',
    profession: user?.profession || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'First name and email address are required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await api.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        city: form.city.trim() || null,
        profession: form.profession.trim() || null,
      });

      await refreshUser();
      toast({
        title: 'Profile Updated!',
        description: 'Your profile details have been saved successfully.',
      });
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="md:text-3xl text-xl font-bold text-gray-900 flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-purple-deep" />
          Edit Profile
        </h1>
        <p className="md:text-base text-sm text-gray-600 mt-1">
          Update your personal information, contact details, and account email.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11"
                required
              />
              <p className="text-xs text-gray-500">
                Changing your email address will update your sign-in email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Mumbai"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession / Industry</Label>
              <Input
                id="profession"
                value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value })}
                placeholder="e.g. Senior Tech Lead"
                className="h-11"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="btn-primary min-w-[140px]">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="border-t border-gray-100 pt-6">
          <MobileNumberLink
            linkedPhone={user.phone}
            onAuthUpdate={(result) => login(result.accessToken, result.user)}
          />
        </div>
      </div>

      {user.role === 'MEMBER' ? <BecomeHostCard /> : null}
    </div>
  );
}

function BecomeHostCard() {
  const [request, setRequest] = useState<RoleRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadRequest = () => {
    setLoading(true);
    api
      .getMyRoleRequest()
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequest();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const created = await api.createRoleRequest(message.trim());
      setRequest(created);
      setMessage('');
      toast({
        title: 'Request sent',
        description: 'An admin will review your request to become a host.',
      });
    } catch (err) {
      toast({
        title: 'Could not send request',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pending = request?.status === 'pending';
  const rejected = request?.status === 'rejected';
  const approved = request?.status === 'approved';

  return (
    <div className="mt-6 bg-white rounded-2xl border border-purple-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-purple-deep">Become a host</h2>
      <p className="mt-1 text-sm text-gray-600">
        Ask an admin to switch your account from member to host so you can create and manage events.
      </p>

      {loading ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking your request…
        </p>
      ) : pending ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your host request is pending review.
          {request.message ? (
            <p className="mt-2 text-amber-800">“{request.message}”</p>
          ) : null}
        </div>
      ) : approved ? (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Your host request was approved. Refresh the page if you are not in the host workspace yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rejected ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Your last request was not approved.
              {request?.adminNote ? (
                <p className="mt-1">Note: {request.adminNote}</p>
              ) : null}
              You can submit a new request below.
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="host-request-message">Message (optional)</Label>
            <Textarea
              id="host-request-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the team why you’d like to host…"
              rows={4}
            />
          </div>
          <Button
            type="button"
            className="btn-primary"
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Request host access
          </Button>
        </div>
      )}
    </div>
  );
}
