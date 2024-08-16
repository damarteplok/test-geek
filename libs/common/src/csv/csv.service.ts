import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

@Injectable()
export class CsvService {
  async generateCsv(
    records: any[],
    header: { id: string; title: string }[],
  ): Promise<Buffer> {
    const csvWriter = createObjectCsvWriter({
      path: 'temp.csv',
      header,
    });

    await csvWriter.writeRecords(records);

    const csvBuffer = fs.readFileSync('temp.csv');
    fs.unlinkSync('temp.csv');

    return Buffer.from(csvBuffer);
  }
}
