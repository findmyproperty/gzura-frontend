import { jsPDF } from 'jspdf';
import { EventInvoice } from '@/lib/api';

export function formatInvoiceDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatInvoiceDateTime(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function downloadInvoicePdf(invoice: EventInvoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(43, 5, 72);
  doc.rect(0, 0, pageWidth, 36, 'F');
  doc.setTextColor(212, 168, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GZURA', 16, 16);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Invoice / Receipt', 16, 28);

  doc.setTextColor(34, 34, 34);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.invoiceNumber, 16, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Issued ${formatInvoiceDateTime(invoice.issuedAt)}`, 16, 57);

  const rows: Array<[string, string]> = [
    ['Billed to', invoice.attendeeName],
    ['Email', invoice.attendeeEmail],
    ['Phone', invoice.attendeePhone || '—'],
    ['Event', invoice.eventTitle],
    ['Format', invoice.eventType || '—'],
    ['Event date', formatInvoiceDate(invoice.eventDate)],
    ['Event time', invoice.eventTime || '—'],
    ['Venue', invoice.venue || (invoice.eventType === 'Online' ? 'Online' : '—')],
    ['Ticket ID', invoice.ticketId],
    [
      'Amount paid',
      `INR ${Number(invoice.amount || 0).toLocaleString('en-IN')}`,
    ],
    ['Payment reference', invoice.paymentRef || '—'],
    ['Order ID', invoice.orderId || '—'],
  ];

  let y = 72;
  rows.forEach(([label, value]) => {
    doc.setTextColor(107, 90, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 16, y);
    doc.setTextColor(34, 34, 34);
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(value, pageWidth - 80);
    doc.text(lines, 70, y);
    y += Math.max(8, lines.length * 6);
  });

  y += 10;
  doc.setDrawColor(212, 168, 44);
  doc.line(16, y, pageWidth - 16, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.text('This receipt confirms payment for your GZURA event ticket.', 16, y);
  doc.text('Keep it for your records. Entry is verified with your event pass.', 16, y + 6);

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
