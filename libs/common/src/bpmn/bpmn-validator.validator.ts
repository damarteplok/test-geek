import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class BpmnValidator extends FileValidator {
  buildErrorMessage(file: Express.Multer.File): string {
    return `Invalid file type. Expected a BPMN file.`;
  }

  isValid(file?: Express.Multer.File): boolean {
    const validExtensions = ['.bpmn'];
    const fileExtension = file.originalname.split('.').pop();
    return validExtensions.includes(`.${fileExtension}`);
  }
}
