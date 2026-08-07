'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    profession: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (value: string) => {
    setForm((prev) => {
      const updated = { ...prev, password: value };
      if (prev.confirmPassword && value !== prev.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
      return updated;
    });
  };

  const handleConfirmPasswordChange = (value: string) => {
    setForm((prev) => {
      const updated = { ...prev, confirmPassword: value };
      if (prev.password && value !== prev.password) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match');
      toast({
        title: 'Password Mismatch',
        description: 'Please ensure both password fields match.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _, ...registerPayload } = form;
      const res = await api.register(registerPayload);
      login(res.accessToken, res.user);
      toast({ title: 'Welcome to GZURA!', description: 'Let\'s personalize your experience.' });
      router.push('/onboarding');
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center">
            <span className="text-purple-deep font-bold text-lg font-display">G</span>
          </div>
          <span className="text-xl font-bold font-display text-purple-deep">GZURA</span>
        </Link>
        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-purple-deep">
          Sign in
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join GZURA</h1>
            <p className="text-gray-600">Create your free member account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="h-11 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className="h-11 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {passwordError ? (
              <p className="text-xs text-red-600 font-medium">{passwordError}</p>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Profession</Label>
                <Input
                  value={form.profession}
                  onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading || !!passwordError} className="btn-primary w-full h-11 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already a member?{' '}
            <Link href="/login" className="text-purple-deep font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}