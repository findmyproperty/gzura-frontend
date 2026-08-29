import * as XLSX from 'xlsx';

export type ExcelCell = string | number | boolean | null | undefined;

export type ExcelRow = Record<string, ExcelCell>;

export function excelDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function downloadExcel(
  rows: ExcelRow[],
  filename: string,
  sheetName = 'Sheet1',
) {
  const data = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, value ?? '']),
    ),
  );
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(
    workbook,
    filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`,
  );
}
