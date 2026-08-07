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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="w-8 h-8 text-purple-deep" />
            My Invoices & Receipts
          </h1>
          <p className="text-gray-600 mt-1">
            View and download tax invoices for all your event enrollments and ticket purchases.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No invoices found</h3>
          <p className="text-sm text-gray-500 mt-1">
            You haven&apos;t enrolled in any events yet. Explore upcoming courses to get started.
          </p>
          <Link href="/events" className="inline-block mt-4">
            <Button className="btn-primary">Explore Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const invoiceNo = `INV-${reg.id.slice(0, 8).toUpperCase()}`;
            const isPaid = reg.paymentStatus === 'PAID';

            return (
              <div
                key={reg.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-purple-deep bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                      {invoiceNo}
                    </span>
                    <Badge className={isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}>
                      {isPaid ? 'PAID' : 'FREE ENROLLMENT'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {reg.event?.title || 'Event Ticket'}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-royal" />
                      {reg.event?.dateStart
                        ? new Date(reg.event.dateStart).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-royal" />
                      {reg.event?.location || 'GZURA Online'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t pt-4 md:border-t-0 md:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Amount Paid</p>
                    <p className="text-xl font-bold text-purple-deep">
                      {reg.amountPaid ? `₹${reg.amountPaid}` : 'Free'}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingId === reg.id}
                    onClick={() => handleDownloadInvoice(reg)}
                    className="border-purple-200 text-purple-deep hover:bg-purple-50"
                  >
                    {downloadingId === reg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
