import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as BpmnModdle from 'bpmn-moddle';
import * as fs from 'fs';
import * as path from 'path';
import { CodeGeneratorService } from './code-generator.service';

@Injectable()
export class BpmnParserService extends CodeGeneratorService {
  private moddle = new BpmnModdle();

  async parseBpmnFromUpload(fileBuffer: Buffer): Promise<any> {
    try {
      const bpmnXml = fileBuffer.toString('utf8');
      return await this.moddle.fromXML(bpmnXml);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async parseBpmn(filePath: string): Promise<any> {
    try {
      const bpmnXml = fs.readFileSync(filePath, 'utf8');
      return await this.moddle.fromXML(bpmnXml);
    } catch (err) {
      console.error(`Error reading BPMN file: ${filePath}`, err);
      throw new InternalServerErrorException(err);
    }
  }

  async parseBpmnFolder(folderPath: string): Promise<any[]> {
    try {
      const files = fs.readdirSync(folderPath);
      const bpmnFiles = files.filter((file) => path.extname(file) === '.bpmn');
      const parsedFiles = [];

      for (const file of bpmnFiles) {
        const definitions = await this.parseBpmn(path.join(folderPath, file));
        parsedFiles.push({ fileName: file, definitions });
      }

      return parsedFiles;
    } catch (err) {
      console.error(`Error reading BPMN folder: ${folderPath}`, err);
      throw new InternalServerErrorException(err);
    }
  }
}
