'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/AuthProvider';
import { MobileNumberLink } from '@/components/auth/MobileNumberLink';
import { api } from '@/lib/api';
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
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-purple-deep" />
          Edit Profile
        </h1>
        <p className="text-gray-600 mt-1">
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
    </div>
  );
}
