import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  InternalServerErrorException,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BpmnParserService, BpmnValidator } from '../bpmn';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio/minio.service';
import { SUCCESS, USERS_BUCKET } from '../constants';
import { Camunda8Service } from './camunda8.service';
import { SearchProcessDefinitionDto, SuccessResponseDto } from '../dto';

@Controller('camunda')
export class Camunda8Controller {
  constructor(
    private readonly bpmnParserService: BpmnParserService,
    private readonly minioService: MinioService,
    private readonly camunda8Service: Camunda8Service,
  ) {}

  @Post('deploy-bpmn')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'application/octet-stream' }),
          new BpmnValidator({}),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { modelName: string },
  ): Promise<SuccessResponseDto> {
    try {
      const bpmnData = await this.bpmnParserService.parseBpmnFromUpload(
        file.buffer,
      );
      const key = `${bpmnData.rootElement.id}-${file.originalname}`;
      await this.minioService.uploadFile({
        bucket: USERS_BUCKET,
        file: file.buffer,
        key,
      });
      const res = await this.camunda8Service.deployBpmn(key, file.buffer);
      return { message: 'success', statusCode: 200, data: res };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('deploy-form')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileForm(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'application/octet-stream' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<SuccessResponseDto> {
    try {
      const key = `${file.originalname}`;
      await this.minioService.uploadFile({
        bucket: USERS_BUCKET,
        file: file.buffer,
        key,
      });
      return { message: SUCCESS, statusCode: 200 };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('login')
  async login() {
    return this.camunda8Service.login();
  }

  @Post('crud')
  async createCrud(@Body() body: { modelName: string }) {
    this.bpmnParserService.generateCrud(body.modelName);
    return { message: SUCCESS, STATUS_CODES: 200 };
  }

  @Post('operate/search/:type')
  async operateProcessDefinitionSearch(
    @Body() body: SearchProcessDefinitionDto,
    @Param('type') type: string,
  ) {
    if (!this.camunda8Service.isValidType(type)) {
      throw new BadRequestException('Type required or not found!');
    }
    return this.camunda8Service.searchOperate(body, type);
  }

  @Get('operate/:type/:key')
  async operateProcessDefinitionGetByKey(
    @Param('key') key: string,
    @Param('type') type: string,
  ) {
    if (!this.camunda8Service.isValidType(type)) {
      throw new BadRequestException('Type required or not found!');
    }
    if (!key) {
      throw new BadRequestException('Key required');
    }
    return this.camunda8Service.searchOperateByKey(key, type);
  }

  @Get('operate/process-definition/:key/xml')
  async operateProcessDefinitionGetByKeyAsXml(@Param('key') key: string) {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    return this.camunda8Service.searchProcessDefinitonByKeyAsXml(key);
  }
}
