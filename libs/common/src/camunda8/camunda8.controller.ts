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
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { BpmnParserService, BpmnValidator } from '../bpmn';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio/minio.service';
import { SUCCESS, USERS_BUCKET } from '../constants';
import { Camunda8Service } from './camunda8.service';
import {
  CreateProcessInstanceDto,
  SearchProcessDefinitionDto,
  SearchTasksDto,
  SuccessResponseDto,
  TaskVariablesDto,
  VariablesDto,
} from '../dto';

@Controller('camunda')
export class Camunda8Controller {
  constructor(
    private readonly bpmnParserService: BpmnParserService,
    private readonly minioService: MinioService,
    private readonly camunda8Service: Camunda8Service,
  ) {}

  @Post('login')
  async login() {
    return this.camunda8Service.login();
  }

  @Post('crud')
  async createCrud(
    @Body() body: { modelName: string },
  ): Promise<SuccessResponseDto> {
    this.bpmnParserService.generateCrud(body.modelName);
    return { message: SUCCESS, statusCode: 200 };
  }

  // ZEEBE

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

  @Post('create-process-instance')
  async createProcessInstance(
    @Body() body: CreateProcessInstanceDto,
  ): Promise<SuccessResponseDto> {
    const data = await this.camunda8Service.createProcessInstance(body);
    return { message: SUCCESS, statusCode: 200, data };
  }

  // URL OPERATE CAMUNDA

  @Post('operate/search/:type')
  async operateSearch(
    @Body() body: SearchProcessDefinitionDto,
    @Param('type') type: string,
  ): Promise<SuccessResponseDto> {
    if (!this.camunda8Service.isValidType(type)) {
      throw new BadRequestException('Type required or not found!');
    }
    const data = await this.camunda8Service.searchOperate(body, type);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('operate/:type/:key')
  async operateGetByKey(
    @Param('key') key: string,
    @Param('type') type: string,
  ): Promise<SuccessResponseDto> {
    if (!this.camunda8Service.isValidType(type)) {
      throw new BadRequestException('Type required or not found!');
    }
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.searchOperateByKey(key, type);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('operate/process-instance/:key/sequence-flows')
  async operateGetSequenceFlowProcessInstanceByKey(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data =
      await this.camunda8Service.searchProcessInstanceSequenceFlowByKey(key);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('operate/process-instance/:key/statistics')
  async operateGetFlowNodeProcessInstanceByKey(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data =
      await this.camunda8Service.searchProcessInstanceFlowNodeByKey(key);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Delete('operate/:type/:key')
  async operateDeleteByKey(
    @Param('key') key: string,
    @Param('type') type: string,
  ): Promise<any> {
    if (!this.camunda8Service.isValidType(type)) {
      throw new BadRequestException('Type required or not found!');
    }
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.deleteOperateByKey(key, type);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('operate/process-definition/:key/xml')
  async operateProcessDefinitionGetByKeyAsXml(
    @Param('key') key: string,
  ): Promise<any> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    return this.camunda8Service.searchProcessDefinitonByKeyAsXml(key);
  }

  @Get('operate/drd/:key/xml')
  async operateDecisionGetByKeyAsXml(@Param('key') key: string): Promise<any> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    return this.camunda8Service.searchProcessDecisionByKeyAsXml(key);
  }

  // URL TASKLIST CAMUNDA

  @Get('tasklist/forms/:key')
  async tasklistFormSearch(
    @Param('key') key: string,
    @Query('processDefinitionKey') processDefinitionKey?: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }

    const data = await this.camunda8Service.searchTasklistFormsByKey(
      key,
      processDefinitionKey,
    );

    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('tasklist/tasks/:key')
  async tasklistGetTaskById(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }

    const data = await this.camunda8Service.searchTasklistTasksByKey(key);

    return { message: SUCCESS, statusCode: 200, data };
  }

  @Get('tasklist/variables/:key')
  async tasklistGetVariablesById(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }

    const data = await this.camunda8Service.searchTasklistVariablesByKey(key);

    return { message: SUCCESS, statusCode: 200, data };
  }

  @Post('tasklist/search/tasks')
  async tasklistTasksSearch(
    @Body() body: SearchTasksDto,
  ): Promise<SuccessResponseDto> {
    const data = await this.camunda8Service.searchTasks(body);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Post('tasklist/search/:key/variables')
  async tasklistTasksVariablesSearch(
    @Param('key') key: string,
    @Body() body: TaskVariablesDto,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.searchTasksVariables(key, body);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Post('tasklist/save/:key/variables')
  async tasklistTasksVariablesSave(
    @Param('key') key: string,
    @Body() body: VariablesDto,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.saveTasksVariables(key, body);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Patch('tasklist/tasks/:key/assign')
  async tasklistTasksAssign(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.patchTasksAssign(key);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Patch('tasklist/tasks/:key/unassign')
  async tasklistTasksUnassign(
    @Param('key') key: string,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.patchTasksUnassign(key);
    return { message: SUCCESS, statusCode: 200, data };
  }

  @Patch('tasklist/tasks/:key/complete')
  async tasklistTasksComplete(
    @Param('key') key: string,
    @Body() body: VariablesDto,
  ): Promise<SuccessResponseDto> {
    if (!key) {
      throw new BadRequestException('Key required');
    }
    const data = await this.camunda8Service.patchTasksComplete(key, body);
    return { message: SUCCESS, statusCode: 200, data };
  }
}
