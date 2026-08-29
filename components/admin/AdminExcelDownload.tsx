'use client';

import { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  adminActionLabelClass,
  adminActionOutlineClass,
  adminMobileIconActionClass,
} from '@/components/admin/AdminDataTable';
import { toast } from '@/hooks/use-toast';
import { downloadExcel, type ExcelRow } from '@/lib/export-excel';
import { cn } from '@/lib/utils';

export function AdminExcelDownload({
  rows,
  filename,
  sheetName = 'Export',
  disabled = false,
  emptyDescription = 'Adjust your filters or wait for the table to load.',
}: {
  rows: ExcelRow[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
  emptyDescription?: string;
}) {
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
      className={cn(adminActionOutlineClass, adminMobileIconActionClass)}
      disabled={disabled || downloading}
      onClick={handleDownload}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-4 w-4" />
      )}
      <span className={adminActionLabelClass}>Excel</span>
    </Button>
  );
}
