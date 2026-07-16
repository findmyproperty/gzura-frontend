'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Loader2, MapPin, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, PassValidationResult } from '@/lib/api';

export default function EventPassPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PassValidationResult | null>(null);

  useEffect(() => {
    if (!token) return;

    api
      .validatePass(token)
      .then(setResult)
      .catch(() =>
        setResult({
          valid: false,
          status: 'invalid',
          message: 'Not a valid pass',
        }),
      )
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-deep" />
      </div>
    );
  }

  const isValid = result?.valid;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl text-center">
        {isValid ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-purple-deep mb-2">
              {result?.status === 'checked_in' ? 'Checked in' : 'Enrolled'}
            </h1>
            <p className="text-gray-600 mb-6">{result?.message}</p>
            <div className="rounded-xl bg-gray-50 p-4 text-left space-y-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Attendee</p>
                <p className="font-semibold text-gray-900">{result?.attendee?.fullName}</p>
                <p className="text-sm text-gray-600">{result?.attendee?.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Event</p>
                <p className="font-semibold text-gray-900">{result?.attendee?.eventTitle}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Venue</p>
                <p className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-royal" />
                  {result?.attendee?.venue}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-9 w-9 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Not a valid pass</h1>
            <p className="text-gray-600 mb-6">
              This QR code could not be verified. Please contact the event organizer.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
              <AlertTriangle className="h-4 w-4" />
              Entry denied
            </div>
          </>
        )}

        <Link href="/">
          <Button variant="outline" className="w-full mt-6">
            Back to GZURA
          </Button>
        </Link>
      </div>
    </div>
  );
}