'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Loader2, MapPin, QrCode, XCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-deep" />
      </div>
    );
  }

  const isValid = result?.valid;
  const qrValue =
    result?.attendee?.passUrl ||
    (typeof window !== 'undefined' ? window.location.href : `https://gzura.com/pass/${token}`);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-28 pb-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl text-center">
        {isValid ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-purple-deep mb-1">
              {result?.status === 'checked_in' ? 'Checked in' : 'Enrolled'}
            </h1>
            <p className="text-sm text-gray-600 mb-6">{result?.message}</p>

            {/* QR Code Pass Box */}
            <div className="my-6 rounded-2xl bg-purple-50/60 p-6 border border-purple-100 flex flex-col items-center justify-center">
              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                <QRCodeCanvas
                  value={qrValue}
                  size={180}
                  level="H"
                  includeMargin
                  className="rounded-lg"
                />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-900 font-semibold font-mono">
                <QrCode className="w-4 h-4 text-gold-royal" />
                PASS ID: {(result?.attendee?.id || token).slice(0, 8).toUpperCase()}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Show this QR code at the venue for quick check-in entry
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-left space-y-3 mb-6 border border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Attendee</p>
                <p className="font-semibold text-gray-900">{result?.attendee?.fullName}</p>
                <p className="text-xs text-gray-600">{result?.attendee?.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Event</p>
                <p className="font-semibold text-gray-900">{result?.attendee?.eventTitle}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Venue</p>
                <p className="flex items-start gap-2 text-xs text-gray-700 mt-0.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-royal" />
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
          <Button variant="outline" className="w-full mt-2 border-purple-200 text-purple-deep hover:bg-purple-50">
            Back to GZURA
          </Button>
        </Link>
      </div>
    </div>
  );
}