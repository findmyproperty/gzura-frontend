'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2, Mail, Phone } from 'lucide-react';
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();

  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mobile OTP state
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
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">
              Sign in to continue your learning journey with GZURA
            </p>
          </div>

          {/* Auth Method Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${loginMethod === 'email'
                  ? 'bg-white text-purple-deep shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Mail className="w-4 h-4" />
              Email Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${loginMethod === 'otp'
                  ? 'bg-white text-purple-deep shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Phone className="w-4 h-4" />
              Mobile OTP
            </button>
          </div>

          {loginMethod === 'email' ? (
            <>
              <div className="space-y-5">
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500">or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4 mt-5">
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 pr-10"
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
                <Button type="submit" disabled={loading} className="btn-primary w-full h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
                </Button>
              </form>
            </>
          ) : (
            /* Mobile OTP Login Flow */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91"
                        className="h-11"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We will send a 6-digit verification code to this phone number.
                    </p>
                  </div>
                  <Button type="submit" disabled={loading} className="btn-primary w-full h-11">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="rounded-lg bg-purple-50 p-3 text-sm text-purple-900 flex justify-between items-center">
                    <span>Code sent to <strong>{phone}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-semibold underline text-purple-700 hover:text-purple-900"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-3 flex flex-col items-center">
                    <Label htmlFor="otp" className="text-center w-full text-sm font-medium">
                      Enter 6-Digit Verification Code
                    </Label>
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(val) => setOtpCode(val)}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                        <InputOTPSlot index={1} className="w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                        <InputOTPSlot index={2} className="w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                        <InputOTPSlot index={3} className="w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                        <InputOTPSlot index={4} className="w-11 h-12 text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                        <InputOTPSlot index={5} className="w-11 h-12 text-lg font-mono font-bold rounded-lg border-2 border-purple-200" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" disabled={loading || otpCode.length < 6} className="btn-primary w-full h-11 mt-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code & Sign In'}
                  </Button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full text-center text-xs text-purple-700 hover:underline font-medium pt-2"
                  >
                    Didn&apos;t receive code? Resend OTP
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            New to GZURA?{' '}
            <Link href="/signup" className="text-purple-deep font-semibold hover:underline">
              Join for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}