import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AdminRegistrationRow } from '@/lib/api';
import { formatAdminDate } from '@/components/admin/AdminDataTable';
import {
  formatInterestLabel,
  formatRegistrationStatusLabel,
} from '@/lib/registration-labels';

const EXPORT_HEADERS = [
  'Full Name',
  'Email',
  'Phone',
  'Type',
  'Status',
  'Source / Interest',
  'Profession',
  'City',
  'Registered',
] as const;

type ExportRecord = Record<(typeof EXPORT_HEADERS)[number], string>;

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function mapRegistrationsForExport(
  rows: AdminRegistrationRow[],
): ExportRecord[] {
  return rows.map((row) => ({
    'Full Name': row.fullName,
    Email: row.email,
    Phone: row.phone || '',
    Type: row.kind === 'community' ? 'Course Host Request' : 'Event',
    Status:
      row.kind === 'community'
        ? formatRegistrationStatusLabel(row.status)
        : '—',
    'Source / Interest':
      row.kind === 'event'
        ? row.event?.title || ''
        : formatInterestLabel(row.interest),
    Profession: row.profession || '',
    City: row.kind === 'event' ? row.city || '' : '',
    Registered: formatAdminDate(row.createdAt),
  }));
}

export function exportRegistrationsExcel(rows: AdminRegistrationRow[]) {
  const data = mapRegistrationsForExport(rows);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  XLSX.writeFile(workbook, `gzura-registrations-${dateStamp()}.xlsx`);
}

export async function exportRegistrationsWord(rows: AdminRegistrationRow[]) {
  const data = mapRegistrationsForExport(rows);

  const headerRow = new TableRow({
    tableHeader: true,
    children: EXPORT_HEADERS.map(
      (header) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: header, bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: '2D0A4E' },
        }),
    ),
  });

  const bodyRows = data.map(
    (record) =>
      new TableRow({
        children: EXPORT_HEADERS.map(
          (header) =>
            new TableCell({
              children: [new Paragraph(record[header] || '—')],
            }),
        ),
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'GZURA Host Registration Report',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated ${new Date().toLocaleString('en-US')}`,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...bodyRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `gzura-registrations-${dateStamp()}.docx`);
}

export function exportRegistrationsPdf(rows: AdminRegistrationRow[]) {
  const data = mapRegistrationsForExport(rows);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(45, 10, 78);
  doc.text('GZURA Host Registration Report', 40, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated ${new Date().toLocaleString('en-US')}`, 40, 58);
  doc.text(`${data.length} registration${data.length === 1 ? '' : 's'}`, 40, 72);

  autoTable(doc, {
    startY: 88,
    head: [EXPORT_HEADERS as unknown as string[]],
    body: data.map((record) => EXPORT_HEADERS.map((header) => record[header] || '—')),
    styles: {
      fontSize: 8,
      cellPadding: 6,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [45, 10, 78],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 240, 250],
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(`gzura-registrations-${dateStamp()}.pdf`);
}