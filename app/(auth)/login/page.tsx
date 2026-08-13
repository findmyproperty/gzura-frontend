'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAuth } from '@/components/providers/AuthProvider';
import { resolvePostLoginRedirect } from '@/lib/auth-utils';
import { isOnboardingComplete } from '@/lib/member-onboarding';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

function AuthDivider() {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-3 text-gray-500">or</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(resolvePostLoginRedirect(user.role, searchParams.get('redirect')));
    }
  }, [user, authLoading, router, searchParams]);

  const completeLogin = useCallback(
    async (res: Awaited<ReturnType<typeof api.login>>) => {
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
        description: `Signed in as ${res.user.firstName || 'Member'}`,
      });

      router.push(destination);
    },
    [login, router, searchParams],
  );

  const handleGoogleSuccess = useCallback(
    async (credential: string) => {
      setLoading(true);
      try {
        const res = await api.loginWithGoogle(credential);
        await completeLogin(res);
      } catch (err) {
        toast({
          title: 'Google sign-in failed',
          description: err instanceof Error ? err.message : 'Please try again',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [completeLogin],
  );

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password.trim());
      await completeLogin(res);
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        title: 'Phone number required',
        description: 'Please enter your mobile number.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp(phone.trim());
      setPhone(res.phone);
      setOtpSent(true);
      toast({
        title: 'OTP Sent!',
        description: res.devOtp
          ? `Use code: ${res.devOtp}`
          : 'Check your mobile for verification code.',
      });
    } catch (err) {
      toast({
        title: 'Could not send OTP',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      toast({
        title: 'OTP Required',
        description: 'Please enter the verification code sent to your phone.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp({ phone: phone.trim(), otp: otpCode.trim() });
      await completeLogin(res);
    } catch (err) {
      toast({
        title: 'OTP Verification Failed',
        description: err instanceof Error ? err.message : 'Invalid verification code.',
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
        <div className="w-full max-w-[380px]">
          <h1 className="text-3xl font-bold text-zinc-900 mb-8">
            {method === 'phone' ? 'Sign in with phone number' : 'Welcome back'}
          </h1>

          {method === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="h-12 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-md pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary h-12 w-full rounded-full text-base"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
              </Button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-deep"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-12 rounded-md"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary h-12 w-full rounded-full text-base"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Next'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-deep"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="rounded-lg bg-purple-50 p-3 text-sm text-purple-900 flex justify-between items-center">
                <span>
                  Code sent to <strong>{phone}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs font-semibold underline text-purple-700 hover:text-purple-900"
                >
                  Change
                </button>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <Label className="w-full text-center text-sm font-medium">
                  Enter 6-digit code
                </Label>
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-11 rounded-lg border-2 border-purple-200 text-center text-lg font-mono font-bold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="btn-primary h-12 w-full rounded-full text-base"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
              </Button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full text-center text-xs font-medium text-purple-700 hover:underline"
              >
                Didn&apos;t receive code? Resend
              </button>
            </form>
          )}

          {method === 'email' ? (
            <div className="mt-8 space-y-3">
              <AuthDivider />
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toast({
                    title: 'Google sign-in unavailable',
                    description: 'Could not load Google sign-in. Please try again.',
                    variant: 'destructive',
                  })
                }
              />
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-zinc-300 bg-white text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                <Smartphone className="h-5 w-5" />
                Sign in with phone number
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <AuthDivider />
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toast({
                    title: 'Google sign-in unavailable',
                    description: 'Could not load Google sign-in. Please try again.',
                    variant: 'destructive',
                  })
                }
              />
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            New to GZURA?{' '}
            <Link href="/signup" className="font-semibold text-purple-deep underline underline-offset-2">
              Join for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
