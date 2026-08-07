'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { api, Event, EventRegistration } from '@/lib/api';

function safeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'event'
  );
}

export default function EventPassDownloadButton({ event }: { event: Event }) {
  const { user, loading: authLoading } = useAuth();
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const [registration, setRegistration] = useState<EventRegistration | null>(
    null,
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!registration?.passUrl || !downloading) return;

    const frame = window.requestAnimationFrame(async () => {
      try {
        const canvas = qrRef.current;
        if (!canvas) throw new Error('The entry QR could not be created');

        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        pdf.setFillColor(43, 5, 72);
        pdf.rect(0, 0, 210, 48, 'F');
        pdf.setTextColor(212, 168, 44);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('GZURA', 18, 18);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(25);
        pdf.text('EVENT PASS', 18, 34);

        pdf.setTextColor(43, 5, 72);
        pdf.setFontSize(20);
        const titleLines = pdf.splitTextToSize(event.title, 112);
        pdf.text(titleLines, 18, 67);

        let detailY = 67 + titleLines.length * 8 + 8;
        const eventDate = new Date(event.dateStart);
        const dateText = eventDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('ATTENDEE', 18, detailY);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(30, 30, 30);
        pdf.text(registration.fullName || user?.email || 'Guest', 18, detailY + 7);

        detailY += 23;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('DATE & TIME', 18, detailY);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        pdf.text(
          `${dateText}${event.timeLabel ? ` | ${event.timeLabel}` : ''}`,
          18,
          detailY + 7,
        );

        detailY += 23;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('VENUE', 18, detailY);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        const venue = [event.venue, event.location].filter(Boolean).join(', ');
        pdf.text(pdf.splitTextToSize(venue, 112), 18, detailY + 7);

        pdf.setDrawColor(225, 225, 225);
        pdf.roundedRect(143, 61, 49, 62, 3, 3, 'S');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 148, 66, 39, 39);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(90, 90, 90);
        pdf.text('Scan at the venue', 167.5, 111, { align: 'center' });
        pdf.text(`Pass ID: ${registration.id.slice(0, 8).toUpperCase()}`, 167.5, 117, {
          align: 'center',
        });

        pdf.setFillColor(248, 246, 250);
        pdf.roundedRect(18, 151, 174, 25, 3, 3, 'F');
        pdf.setFontSize(10);
        pdf.setTextColor(75, 75, 75);
        pdf.text(
          'Keep this pass ready on your phone or bring a printed copy.',
          105,
          162,
          { align: 'center' },
        );
        pdf.text('The QR code is unique to your registration.', 105, 168, {
          align: 'center',
        });

        pdf.save(`${safeFileName(event.title)}-event-pass.pdf`);
        toast({
          title: 'Event pass downloaded',
          description: 'Your PDF pass is ready.',
        });
      } catch (error) {
        toast({
          title: 'Could not download pass',
          description:
            error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        });
      } finally {
        setDownloading(false);
        setRegistration(null);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [downloading, event, registration, user?.email]);

  const [userRegistration, setUserRegistration] = useState<EventRegistration | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user || event.type !== 'Offline') {
      setUserRegistration(null);
      setChecking(false);
      return;
    }

    api
      .getMyRegistrations()
      .then((list) => {
        const match = list.find((item) => item.eventId === event.id);
        setUserRegistration(match || null);
      })
      .catch(() => setUserRegistration(null))
      .finally(() => setChecking(false));
  }, [user, event.id, event.type]);

  if (authLoading || checking || !user || !userRegistration || event.type !== 'Offline') return null;

  const downloadPass = async () => {
    setDownloading(true);
    try {
      const registrations = await api.getMyRegistrations();
      const match = registrations.find((item) => item.eventId === event.id);

      if (!match?.passUrl) {
        throw new Error('Enroll in this event before downloading its pass.');
      }
      setRegistration(match);
    } catch (error) {
      setDownloading(false);
      toast({
        title: 'Event pass unavailable',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        title="Download event pass"
        aria-label="Download event pass"
        disabled={downloading}
        onClick={downloadPass}
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
      {registration?.passUrl ? (
        <QRCodeCanvas
          ref={qrRef}
          value={registration.passUrl}
          size={600}
          level="M"
          includeMargin
          className="fixed -left-[10000px] top-0"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
