'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/AuthProvider';
import { resolvePostLoginRedirect } from '@/lib/auth-utils';
import { isOnboardingComplete } from '@/lib/member-onboarding';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(resolvePostLoginRedirect(user.role, searchParams.get('redirect')));
    }
  }, [user, authLoading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password.trim());
      login(res.accessToken, res.user);

      let destination = resolvePostLoginRedirect(
        res.user.role,
        searchParams.get('redirect'),
      );

      if (res.user.role === 'MEMBER' && !isOnboardingComplete(res.user)) {
        destination = '/onboarding';
      }

      toast({
        title: 'Welcome back!',
        description: `Signed in as ${res.user.firstName}`,
      });

      router.push(destination);
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center">
            <span className="text-purple-deep font-bold text-lg font-display">G</span>
          </div>
          <span className="text-xl font-bold font-display text-purple-deep">GZURA</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-purple-deep">
          Exit
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">
              Sign in to continue your learning journey with GZURA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="btn-primary w-full h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New to GZURA?{' '}
            <Link href="/signup" className="text-purple-deep font-semibold hover:underline">
              Join for free
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8 pt-6 border-t border-gray-100">
            Demo: user@gzura.com / User@123 · admin@gzura.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}