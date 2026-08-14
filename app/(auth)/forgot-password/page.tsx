'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast({
        title: 'Email or phone required',
        description: 'Enter the email or mobile number on your GZURA account.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(identifier.trim());
      setDevResetUrl(res.devResetUrl || null);
      setSent(true);
      toast({
        title: 'Check your inbox and messages',
        description: res.message,
      });
    } catch (err) {
      toast({
        title: 'Could not send reset link',
        description: err instanceof Error ? err.message : 'Please try again.',
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

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          {sent ? (
            <>
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Check your email and phone</h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                If an account exists for that email or number, we sent a reset link by Gmail and SMS.
                The link expires in 1 hour.
              </p>
              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-purple-deep" />
                  Look in your inbox and spam folder for a message from GZURA.
                </p>
                <p className="flex items-start gap-2">
                  <Smartphone className="mt-0.5 h-4 w-4 text-purple-deep" />
                  If a mobile number is on the account, the same link is sent by SMS.
                </p>
              </div>
              {devResetUrl ? (
                <p className="mt-4 text-xs text-gray-500 break-all">
                  Dev reset link:{' '}
                  <Link href={devResetUrl} className="text-purple-deep underline">
                    {devResetUrl}
                  </Link>
                </p>
              ) : null}
              <Button asChild className="btn-primary h-12 w-full rounded-full text-base mt-8">
                <Link href="/login">Back to sign in</Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-purple-deep mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900 mb-3">Forgot password</h1>
              <p className="text-sm text-gray-600 mb-8">
                Enter your email or phone number. We will send a reset link to both Gmail and SMS when those details are on your account.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or phone number</Label>
                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@domain.com or +91 98765 43210"
                    className="h-12 rounded-md"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-12 w-full rounded-full text-base"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
