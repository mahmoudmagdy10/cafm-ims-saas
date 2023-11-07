import * as XLSX from 'xlsx';
export function ExportTOExcelShared(Table: any) {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(Table);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, 'SheetJS.xlsx');
}
