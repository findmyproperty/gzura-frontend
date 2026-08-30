'use client';

import { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { downloadExcel, type ExcelRow } from '@/lib/export-excel';

export type AdminExcelConfig = {
  rows: ExcelRow[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
  emptyDescription?: string;
};

export function AdminExcelDownload({
  rows,
  filename,
  sheetName = 'Export',
  disabled = false,
  emptyDescription = 'Adjust your filters or wait for the table to load.',
}: AdminExcelConfig) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (rows.length === 0) {
      toast({
        title: 'Nothing to export',
        description: emptyDescription,
        variant: 'destructive',
      });
      return;
    }

    setDownloading(true);
    try {
      downloadExcel(rows, filename, sheetName);
      toast({
        title: 'Excel ready',
        description: `Downloaded ${rows.length} row${rows.length === 1 ? '' : 's'}.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 gap-2 rounded-lg border-[#E5E7EB] bg-white px-3.5 py-0 text-[13px] font-medium text-gray-700 shadow-none hover:border-purple-deep hover:bg-purple-50 hover:text-purple-deep"
      disabled={disabled || downloading}
      onClick={handleDownload}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-4 w-4" />
      )}
      Excel
    </Button>
  );
}
