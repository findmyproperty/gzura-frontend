'use client';

import { useState } from 'react';
import { Check, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { api, type AuthResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

type MobileNumberLinkProps = {
  linkedPhone?: string | null;
  onAuthUpdate: (result: AuthResponse) => void;
  tone?: 'admin' | 'default';
};

export function MobileNumberLink({
  linkedPhone,
  onAuthUpdate,
  tone = 'default',
}: MobileNumberLinkProps) {
  const [editing, setEditing] = useState(!linkedPhone);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  const inputClass =
    tone === 'admin'
      ? 'h-11 rounded-xl bg-[#F8F6FB]'
      : 'h-11';

  const resetDraft = () => {
    setPhone('');
    setOtpSent(false);
    setOtpCode('');
    setEditing(!linkedPhone);
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!phone.trim()) {
      toast({
        title: 'Mobile number required',
        description: 'Enter the number you want to link.',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    try {
      const res = await api.sendLinkPhoneOtp(phone.trim());
      setPhone(res.phone);
      setOtpSent(true);
      toast({
        title: 'Code sent',
        description: res.devOtp
          ? `Use code: ${res.devOtp}`
          : `We sent a 6-digit code to ${res.phone}.`,
      });
    } catch (err) {
      toast({
        title: 'Could not send code',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otpCode.length < 6) {
      toast({
        title: 'Enter the 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setVerifying(true);
    try {
      const res = await api.verifyLinkPhone(phone.trim(), otpCode.trim());
      onAuthUpdate(res);
      setEditing(false);
      setOtpSent(false);
      setOtpCode('');
      setPhone('');
      toast({
        title: 'Mobile number linked',
        description: 'You can now sign in with this number.',
      });
    } catch (err) {
      toast({
        title: 'Could not verify number',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleUnlink = async () => {
    setUnlinking(true);
    try {
      const res = await api.unlinkPhone();
      onAuthUpdate(res);
      setEditing(true);
      setOtpSent(false);
      setOtpCode('');
      setPhone('');
      toast({ title: 'Mobile number unlinked' });
    } catch (err) {
      toast({
        title: 'Could not unlink number',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUnlinking(false);
    }
  };

  if (linkedPhone && !editing) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor="linked-phone" className="text-sm text-zinc-800">
          Mobile number
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Input
              id="linked-phone"
              value={linkedPhone}
              readOnly
              className={cn(inputClass, 'pr-24 text-gray-700')}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <Check className="h-3 w-3" />
              Linked
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(true);
                setPhone('');
                setOtpSent(false);
                setOtpCode('');
              }}
              className={cn(
                'h-11',
                tone === 'admin' && 'rounded-xl border-gray-200 bg-white',
              )}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={unlinking}
              onClick={handleUnlink}
              className="h-11 text-gray-500 hover:text-red-600"
            >
              {unlinking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlink'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Use this number on the login page to sign in with a one-time code.
        </p>
      </div>
    );
  }

  if (otpSent) {
    return (
      <form onSubmit={handleVerify} className="space-y-3">
        <Label className="text-sm text-zinc-800">Verify mobile number</Label>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to <strong>{phone}</strong>
        </p>
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
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={verifying || otpCode.length < 6}
            className={cn('h-11 px-5', tone === 'admin' ? 'btn-admin' : 'btn-primary')}
          >
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify and link'}
          </Button>
          <Button type="button" variant="ghost" className="h-11" onClick={resetDraft}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="space-y-1.5">
      <Label htmlFor="link-phone" className="text-sm text-zinc-800">
        Mobile number
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="link-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className={cn(inputClass, 'flex-1')}
        />
        <Button
          type="submit"
          disabled={sending}
          className={cn(
            'h-11 shrink-0 px-5',
            tone === 'admin' ? 'btn-admin' : 'btn-primary',
          )}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send code'}
        </Button>
        {linkedPhone ? (
          <Button type="button" variant="ghost" className="h-11" onClick={resetDraft}>
            Cancel
          </Button>
        ) : null}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <Phone className="h-3 w-3" />
        We’ll send an OTP to confirm this number, then you can use it to sign in.
      </p>
    </form>
  );
}
