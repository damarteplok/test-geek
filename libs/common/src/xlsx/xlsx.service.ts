import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class XlsxService {
  generateXlsx(
    sheetData: any[][],
    sheetName: string = 'Sheet1',
    fileType: XLSX.BookType = 'xlsx',
  ): Buffer {
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, { type: 'buffer', bookType: fileType });
  }
}
