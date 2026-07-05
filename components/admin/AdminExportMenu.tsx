'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { AdminRegistrationRow } from '@/lib/api';
import {
  exportRegistrationsExcel,
  exportRegistrationsPdf,
  exportRegistrationsWord,
} from '@/lib/export-registrations';

type ExportFormat = 'excel' | 'word' | 'pdf';

export function AdminExportMenu({
  rows,
  disabled = false,
}: {
  rows: AdminRegistrationRow[];
  disabled?: boolean;
}) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (rows.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'Adjust your filters or wait for registrations to load.',
        variant: 'destructive',
      });
      return;
    }

    setExporting(format);

    try {
      if (format === 'excel') {
        exportRegistrationsExcel(rows);
      } else if (format === 'word') {
        await exportRegistrationsWord(rows);
      } else {
        exportRegistrationsPdf(rows);
      }

      toast({
        title: 'Export ready',
        description: `Downloaded ${rows.length} registration${
          rows.length === 1 ? '' : 's'
        } as ${format === 'excel' ? 'Excel' : format === 'word' ? 'Word' : 'PDF'}.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-purple-deep hover:bg-purple-50"
          disabled={disabled || exporting !== null}
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          disabled={exporting !== null}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('word')}
          disabled={exporting !== null}
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}