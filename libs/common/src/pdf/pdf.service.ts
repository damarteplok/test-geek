import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class PdfService {
  async generatePdf(text: string = 'Hello, World!'): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    page.drawText(text, { x: 50, y: 350, size: 30, color: rgb(0, 0.53, 0.71) });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
