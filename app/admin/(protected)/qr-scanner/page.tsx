'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ScanLine,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, PassValidationResult } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

function extractAccessToken(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/\/pass\/([a-f0-9]+)/i);
  return match?.[1] ?? trimmed;
}

export default function AdminQrScannerPage() {
  const mountId = useId().replace(/:/g, '');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const stoppingRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PassValidationResult | null>(null);

  const stopScanner = useCallback(async () => {
    if (!scannerRef.current || stoppingRef.current) {
      setScanning(false);
      return;
    }

    stoppingRef.current = true;
    const scanner = scannerRef.current;
    scannerRef.current = null;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Scanner may already be stopped.
    }

    try {
      scanner.clear();
    } catch {
      // clear() can fail if the library already removed its nodes.
    }

    stoppingRef.current = false;
    setScanning(false);
  }, []);

  const handleScan = useCallback(async (decodedText: string) => {
    const token = extractAccessToken(decodedText);
    if (!token) return;

    setLoading(true);
    try {
      const validation = await api.checkInPass(token);
      setResult(validation);

      if (validation.valid) {
        toast({
          title: 'Valid pass',
          description: `${validation.attendee?.fullName} — ${validation.message}`,
        });
      } else {
        toast({
          title: 'Invalid pass',
          description: validation.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scan failed';
      setResult({
        valid: false,
        status: 'invalid',
        message,
      });
      toast({
        title: 'Scan failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const startScanner = useCallback(async () => {
    setResult(null);

    await stopScanner();

    const scanner = new Html5Qrcode(mountId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 8, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner();
          await handleScan(decodedText);
        },
        () => undefined,
      );
      setScanning(true);
    } catch (err) {
      scannerRef.current = null;
      setScanning(false);
      toast({
        title: 'Camera unavailable',
        description:
          err instanceof Error
            ? err.message
            : 'Allow camera access to scan entry passes.',
        variant: 'destructive',
      });
    }
  }, [handleScan, mountId, stopScanner]);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-deep">QR Scanner</h1>
        <p className="text-gray-600 mt-1">
          Scan offline event passes to verify enrollment and check in attendees.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="relative overflow-hidden rounded-xl bg-gray-50 min-h-[280px]">
          {/* html5-qrcode owns this node — never render React children inside it */}
          <div id={mountId} className="min-h-[280px] w-full" />

          {!scanning ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-gray-500 px-6">
              <div>
                <ScanLine className="h-10 w-10 mx-auto mb-3 text-purple-deep/40" />
                <p className="text-sm">Camera preview will appear here</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3">
          {!scanning ? (
            <Button className="btn-primary flex-1" onClick={startScanner} disabled={loading}>
              <ScanLine className="mr-2 h-4 w-4" />
              Start scanning
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" onClick={stopScanner}>
              Stop scanner
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              void startScanner();
            }}
            disabled={loading}
          >
            Scan again
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-deep" />
        </div>
      ) : null}

      {result ? (
        <div
          className={`rounded-2xl border p-6 ${
            result.valid
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.valid ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h2
                className={`text-lg font-semibold ${
                  result.valid ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {result.valid
                  ? result.status === 'checked_in'
                    ? 'Enrolled — checked in'
                    : 'Enrolled'
                  : 'Not a valid pass'}
              </h2>
              <p className={`mt-1 text-sm ${result.valid ? 'text-emerald-700' : 'text-red-700'}`}>
                {result.message}
              </p>
              {result.attendee ? (
                <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm text-gray-800 space-y-1">
                  <p>
                    <strong>Attendee:</strong> {result.attendee.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {result.attendee.email}
                  </p>
                  <p>
                    <strong>Event:</strong> {result.attendee.eventTitle}
                  </p>
                  <p>
                    <strong>Venue:</strong> {result.attendee.venue}
                  </p>
                </div>
              ) : null}
              {!result.valid ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Entry should be denied for this pass.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}