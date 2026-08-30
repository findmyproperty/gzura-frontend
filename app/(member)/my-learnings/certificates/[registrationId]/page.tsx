'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Loader2, Printer } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { api, EventRegistration } from '@/lib/api';
import { hasCertificate } from '@/lib/learning-status';

export default function CertificatePage({
  params,
}: {
  params: { registrationId: string };
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=/my-learnings/certificates/${params.registrationId}`);
      return;
    }

    api
      .getMyRegistrations()
      .then((rows) => {
        const match =
          rows.find((row) => row.id === params.registrationId && hasCertificate(row)) ?? null;
        setRegistration(match);
      })
      .finally(() => setDataLoading(false));
  }, [user, loading, params.registrationId, router]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
      </div>
    );
  }

  if (!registration || !registration.event) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Certificate not found</h1>
        <p className="text-gray-600 text-sm mb-6">
          This certificate may not exist or you may not have access to it.
        </p>
        <Button asChild variant="outline">
          <Link href="/my-learnings?tab=certificates">Back to certificates</Link>
        </Button>
      </div>
    );
  }

  const event = registration.event;
  const eventDate = new Date(event.dateStart).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const issuedDate = registration.certificateIssuedAt
    ? new Date(registration.certificateIssuedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between gap-4 print:hidden">
        <Button asChild variant="outline">
          <Link href="/my-learnings?tab=certificates">Back</Link>
        </Button>
        <Button className="btn-primary" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          Print certificate
        </Button>
      </div>

      <div
        id="certificate"
        className="max-w-3xl mx-auto bg-white border-2 border-purple-100 rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border-purple-200 print:rounded-none"
      >
        <div className="h-2 bg-gradient-to-r from-purple-deep via-purple-600 to-gold-400" />
        <div className="p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
            <Award className="h-9 w-9 text-gold-royal" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-deep mb-2">
            Certificate of Completion
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-serif">
            GZURA
          </h1>
          <p className="text-gray-600 mb-2">This certifies that</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-deep mb-6">
            {registration.fullName}
          </p>
          <p className="text-gray-600 mb-2">has successfully completed</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{event.title}</p>
          <p className="text-sm text-gray-500 mb-8">Event date: {eventDate}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                Certificate no.
              </p>
              <p className="text-sm font-semibold text-gray-800">{registration.certificateNumber}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Issued on</p>
              <p className="text-sm font-semibold text-gray-800">{issuedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
