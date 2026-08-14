'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Download, FileText, Loader2, MapPin, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { api, EventRegistration } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

function safeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'invoice'
  );
}

export default function MemberInvoicesPage() {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .getMyRegistrations()
      .then((data) => setRegistrations(data))
      .catch((err) => {
        toast({
          title: 'Could not load invoices',
          description: err instanceof Error ? err.message : 'Please try again',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDownloadInvoice = async (registration: EventRegistration) => {
    setDownloadingId(registration.id);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header Banner
      pdf.setFillColor(43, 5, 72);
      pdf.rect(0, 0, 210, 48, 'F');
      pdf.setTextColor(212, 168, 44);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('GZURA', 18, 18);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text('PAYMENT RECEIPT / INVOICE', 18, 34);

      // Invoice metadata
      const invoiceNo = `INV-${registration.id.slice(0, 8).toUpperCase()}`;
      pdf.setTextColor(43, 5, 72);
      pdf.setFontSize(16);
      pdf.text(invoiceNo, 18, 62);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Issued Date: ${new Date(registration.createdAt).toLocaleDateString('en-IN')}`, 18, 70);

      // Billed To
      let y = 85;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      pdf.text('BILLED TO:', 18, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(registration.fullName || user?.email || 'Valued Member', 18, y + 6);
      pdf.text(registration.email, 18, y + 12);
      if (registration.phone) pdf.text(`Phone: ${registration.phone}`, 18, y + 18);

      // Item Table Header
      y += 32;
      pdf.setFillColor(248, 246, 250);
      pdf.rect(18, y, 174, 10, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(43, 5, 72);
      pdf.text('ITEM DESCRIPTION', 22, y + 7);
      pdf.text('TYPE', 130, y + 7);
      pdf.text('AMOUNT', 165, y + 7);

      // Item Row
      y += 18;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      const title = registration.event?.title || 'Event Enrollment';
      pdf.text(pdf.splitTextToSize(title, 100), 22, y);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(registration.event?.type || 'Event', 130, y);

      const amountStr = registration.amountPaid ? `INR ${registration.amountPaid.toFixed(2)}` : 'FREE';
      pdf.setFont('helvetica', 'bold');
      pdf.text(amountStr, 165, y);

      // Divider & Total
      y += 20;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(18, y, 192, y);

      y += 12;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(43, 5, 72);
      pdf.text('TOTAL PAID:', 130, y);
      pdf.text(amountStr, 165, y);

      // Payment Details Footer
      y += 25;
      pdf.setFillColor(248, 246, 250);
      pdf.roundedRect(18, y, 174, 30, 3, 3, 'F');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Payment Status: ${registration.paymentStatus || 'FREE'}`, 24, y + 10);
      if (registration.razorpayPaymentId) {
        pdf.text(`Razorpay Payment ID: ${registration.razorpayPaymentId}`, 24, y + 18);
      }
      pdf.text('Thank you for learning with GZURA!', 24, y + 24);

      pdf.save(`${safeFileName(title)}-${invoiceNo}.pdf`);
      toast({ title: 'Invoice downloaded', description: 'Your PDF invoice is ready.' });
    } catch (err) {
      toast({
        title: 'Could not download invoice',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (authLoading) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:gap-3 sm:text-3xl">
          <Receipt className="h-5 w-5 shrink-0 text-purple-deep sm:h-8 sm:w-8" />
          My Invoices & Receipts
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Download receipts for your event enrollments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-deep" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven&apos;t enrolled in any events yet. Explore upcoming courses to get started.
          </p>
          <Link href="/events" className="mt-4 inline-block">
            <Button className="btn-primary">Explore Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {registrations.map((reg) => {
            const invoiceNo = `INV-${reg.id.slice(0, 8).toUpperCase()}`;
            const isPaid = reg.paymentStatus === 'PAID';
            const issuedOn = new Date(reg.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const eventDate = reg.event?.dateStart
              ? new Date(reg.event.dateStart).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Date TBA';
            const location = reg.event?.location || 'GZURA Online';

            return (
              <article
                key={reg.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold tracking-wide text-purple-deep sm:text-xs">
                      {invoiceNo}
                    </p>
                    <h3 className="mt-1 truncate text-base font-bold text-gray-900 sm:text-lg">
                      {reg.event?.title || 'Event Ticket'}
                    </h3>
                  </div>
                  <Badge
                    className={
                      isPaid
                        ? 'shrink-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                        : 'shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {isPaid ? 'Paid' : 'Free'}
                  </Badge>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-gray-600 sm:flex sm:flex-wrap sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-gold-royal" />
                    <div className="min-w-0">
                      <dt className="sr-only">Event date</dt>
                      <dd>{eventDate}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 shrink-0 text-gold-royal" />
                    <div className="min-w-0">
                      <dt className="sr-only">Issued</dt>
                      <dd>Issued {issuedOn}</dd>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-start gap-1.5 sm:col-span-1">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-royal" />
                    <div className="min-w-0">
                      <dt className="sr-only">Location</dt>
                      <dd className="line-clamp-1" title={location}>
                        {location}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Amount paid
                    </p>
                    <p className="text-lg font-bold text-purple-deep">
                      {reg.amountPaid ? `₹${reg.amountPaid}` : 'Free'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingId === reg.id}
                    onClick={() => handleDownloadInvoice(reg)}
                    className="w-full border-purple-200 text-purple-deep hover:bg-purple-50 sm:w-auto"
                  >
                    {downloadingId === reg.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
