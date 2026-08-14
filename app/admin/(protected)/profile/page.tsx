'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Lock, Mail, Phone, Shield, Trash2, Upload } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AdminPageHeader } from '@/components/admin/admin-chrome';
import { MobileNumberLink } from '@/components/auth/MobileNumberLink';
import { api } from '@/lib/api';
import { formatUserRole } from '@/lib/user-roles';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function splitFullName(fullName: string) {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  };
}

export default function AdminProfilePage() {
  const { user, login, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'A';
  const isStaff = user?.role === 'HOST' || user?.role === 'ADMIN';
  const googleAccount = user?.hasPassword === false && !isStaff;
  const needsPasswordSetup = Boolean(isStaff && user?.hasPassword === false);
  const displayName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Your profile';

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    setFullName(`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim());
  }, [user]);

  const persistProfile = async (payload: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }) => {
    const result = await api.updateAuthProfile(payload);
    login(result.accessToken, result.user);
    return result.user;
  };

  const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      toast({
        title: 'Invalid file',
        description: 'Please choose a PNG or JPEG image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Profile photos must be 10 MB or smaller.',
        variant: 'destructive',
      });
      return;
    }

    setSavingPhoto(true);
    try {
      const uploaded = await api.uploadProfileAvatar(file);
      await persistProfile({ avatarUrl: uploaded.url });
      toast({ title: 'Photo updated' });
    } catch (err) {
      toast({
        title: 'Could not upload photo',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.avatarUrl) return;
    setSavingPhoto(true);
    try {
      await persistProfile({ avatarUrl: '' });
      toast({ title: 'Photo removed' });
    } catch (err) {
      toast({
        title: 'Could not remove photo',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSaveName = async () => {
    const { firstName, lastName } = splitFullName(fullName);
    if (!firstName) {
      toast({
        title: 'Name is required',
        variant: 'destructive',
      });
      return;
    }

    setSavingName(true);
    try {
      await persistProfile({ firstName, lastName });
      toast({ title: 'Name saved' });
    } catch (err) {
      toast({
        title: 'Could not save name',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Use at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword(
        needsPasswordSetup ? undefined : currentPassword,
        newPassword,
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refreshUser();
      toast({
        title: needsPasswordSetup ? 'Password set' : 'Password updated',
      });
    } catch (err) {
      toast({
        title: needsPasswordSetup
          ? 'Could not set password'
          : 'Could not change password',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminPageHeader breadcrumb="Admin / Profile" title="Profile" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleUploadPhoto}
      />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(260px,32%)_minmax(0,1fr)]">
        <aside className="relative overflow-hidden rounded-3xl border border-purple-100/80 bg-white p-8 shadow-[0_12px_40px_-24px_rgba(45,10,78,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(201,162,39,0.18),transparent_58%),linear-gradient(180deg,#F5F0FA_0%,#ffffff_62%)]" />
          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 border-[3px] border-white shadow-md ring-1 ring-purple-100">
                {user?.avatarUrl ? (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={displayName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-gold-royal to-gold-400 text-purple-deep text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                disabled={savingPhoto}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md ring-2 ring-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
              >
                {savingPhoto ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900">
              {displayName}
            </h2>
            {user?.role ? (
              <span className="mt-2 rounded-full bg-purple-deep/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-purple-deep">
                {formatUserRole(user.role)}
              </span>
            ) : null}
            <p className="mt-2 flex max-w-full items-center justify-center gap-1.5 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </p>
            {user?.phone ? (
              <p className="mt-1.5 flex max-w-full items-center justify-center gap-1.5 text-sm text-gray-500">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.phone}</span>
              </p>
            ) : null}
            <div className="mt-6 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={savingPhoto}
                onClick={() => fileInputRef.current?.click()}
                className="h-9 rounded-full border-gray-200 bg-white px-4"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={savingPhoto || !user?.avatarUrl}
                onClick={handleRemovePhoto}
                className="h-9 rounded-full px-4 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-400">PNGs and JPEGs, up to 10 MB.</p>
          </div>
        </aside>

        <div className="flex min-h-0 flex-col gap-4">
          <section className="rounded-3xl border border-purple-100/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(45,10,78,0.35)] sm:p-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full-name" className="text-sm text-zinc-800">
                  Full name
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 rounded-xl bg-[#F8F6FB]"
                  />
                  <Button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="btn-admin h-11 shrink-0 px-5"
                  >
                    {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-sm text-zinc-800">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="profile-email"
                    value={user?.email ?? ''}
                    readOnly
                    className="h-11 rounded-xl bg-[#F8F6FB] pr-10 text-gray-600"
                  />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="md:col-span-2">
                <MobileNumberLink
                  linkedPhone={user?.phone}
                  tone="admin"
                  onAuthUpdate={(result) => login(result.accessToken, result.user)}
                />
              </div>
            </div>
          </section>

          <section className="flex flex-1 flex-col rounded-3xl border border-purple-100/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(45,10,78,0.35)] sm:p-8">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Shield className="h-3.5 w-3.5" />
              Security
            </p>

            {googleAccount ? (
              <div className="flex flex-1 items-center rounded-2xl border border-purple-100 bg-[#F8F6FB] px-5 py-5">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-purple-deep/70" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      Password is managed by your sign-in provider
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      You signed in with Google, so there is no password to change here.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="flex flex-1 flex-col">
                {needsPasswordSetup ? (
                  <p className="mb-4 text-sm text-gray-500">
                    This account was created with Google. Set a password to also sign in with email.
                  </p>
                ) : null}
                <div
                  className={
                    needsPasswordSetup
                      ? 'grid flex-1 content-start gap-4 sm:grid-cols-2'
                      : 'grid flex-1 content-start gap-4 sm:grid-cols-3'
                  }
                >
                  {needsPasswordSetup ? null : (
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-xs text-gray-500">
                        Current password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="h-11 rounded-xl bg-[#F8F6FB]"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs text-gray-500">
                      New password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-[#F8F6FB]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs text-gray-500">
                      Confirm password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-[#F8F6FB]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="btn-admin h-11 px-6"
                  >
                    {savingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : needsPasswordSetup ? (
                      'Set password'
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
