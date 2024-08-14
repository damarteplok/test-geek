import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { PROCESS, USERTASK } from '../constants';
import { DeployCamundaResponse } from '../interfaces';

@Injectable()
export class CodeGeneratorService {
  constructor(private readonly configService: ConfigService) {}

  private toPascalCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^|_)([a-z])/g, (_, c: string) => (c ? c.toUpperCase() : ''));
  }

  private generateFolder(moduleName: string, subsFolder?: string): string {
    const nameModule = this.toPascalCase(moduleName);
    let stringPath = `./src/${nameModule.toLocaleLowerCase()}`;
    if (subsFolder) {
      stringPath = stringPath + `/${subsFolder}`;
    }
    const moduleDir = path.resolve(
      this.configService.getOrThrow<string>('ROOTDIR'),
      stringPath,
    );
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir);
    }

    return moduleDir;
  }

  private generateFilterProcess = `
  @Expose()
  processDefinitionKey: string;

  @Expose()
  bpmnProcessId: string;

  @Expose()
  version: number;

  @Expose()
  path_minio: string;

  @Expose()
  servicesTask: string;

  @Expose()
  processInstanceKey: string;

  @Expose()
  formId: string;

  @Expose()
  taskDefinitionId: string;

  @Expose()
  taskId: string;
  `;
  private generateFilterUserTask = `
  @Expose()
  processDefinitionKey: string;

  @Expose()
  processVariables: string;

  @Expose()
  processInstanceKey: string;

  @Expose()
  formId: string;

  @Expose()
  taskDefinitionId: string;

  @Expose()
  taskId: string;
  `;

  private generateDtos(moduleName: string, typeGenerate: string = ''): void {
    const moduleDir = this.generateFolder(moduleName, 'dtos');
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class ${moduleNameFilter}Dto {
  @Expose()
  id: number;

  ${typeGenerate === PROCESS ? this.generateFilterProcess : ''}

  ${typeGenerate === USERTASK ? this.generateFilterUserTask : ''}

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  created_at: Date;

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  updated_at: Date;
}
    `;

    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.dto.ts`),
      moduleContent.trim(),
    );

    const moduleContentCreate = `
${typeGenerate === PROCESS ? `import { CreateProcessFieldDto } from '@app/common';` : ''}
${typeGenerate === USERTASK ? `import { CreateSubmitableFieldDto } from '@app/common';` : ''}

export class Create${moduleNameFilter}Dto ${typeGenerate === PROCESS ? 'extends CreateProcessFieldDto' : ''}${typeGenerate === USERTASK ? 'extends CreateSubmitableFieldDto' : ''}{
  
}
    `;

    fs.writeFileSync(
      path.resolve(
        moduleDir,
        `create-${moduleNameFilter.toLowerCase()}.dto.ts`,
      ),
      moduleContentCreate.trim(),
    );

    const moduleContentUpdate = `
import { PartialType } from '@nestjs/swagger';
import { Create${moduleNameFilter}Dto } from './create-${moduleNameFilter.toLocaleLowerCase()}.dto';

export class Update${moduleNameFilter}Dto extends PartialType(Create${moduleNameFilter}Dto){
  
}
    `;

    fs.writeFileSync(
      path.resolve(
        moduleDir,
        `update-${moduleNameFilter.toLowerCase()}.dto.ts`,
      ),
      moduleContentUpdate.trim(),
    );

    const moduleContentFilter = `
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, ${typeGenerate !== '' ? 'IsString' : ''} } from 'class-validator';
import { CommonSearchFieldDto } from '@app/common';
import { FindOptionsOrder } from 'typeorm';
import { ${moduleNameFilter} } from '../models/${moduleNameFilter.toLowerCase()}.entity';

export class Filter${moduleNameFilter}Dto extends PartialType(CommonSearchFieldDto) {
  ${
    typeGenerate !== ''
      ? `@ApiPropertyOptional({
    type: 'processDefinitionKey',
    description:
      'Search by processDefinitionKey, e.g., { "processDefinitionKey": "xxxx" }',
  })
  @IsOptional()
  @IsString()
  processDefinitionKey: string;

  @ApiPropertyOptional({
    type: 'processInstanceKey',
    description:
      'Search by processInstanceKey, e.g., { "processInstanceKey": "xxxx" }',
  })
  @IsOptional()
  @IsString()
  processInstanceKey: string;`
      : ''
  }
  
  @ApiPropertyOptional({
    type: Object,
    description:
      'Order by fields, e.g., { "name": "ASC", "created_at": "DESC" }',
  })
  @IsOptional()
  order: FindOptionsOrder<${moduleNameFilter}>;
}
    `;

    fs.writeFileSync(
      path.resolve(
        moduleDir,
        `filter-${moduleNameFilter.toLowerCase()}.dto.ts`,
      ),
      moduleContentFilter.trim(),
    );
  }

  private generateModelsUserTask(
    processVariables: string = '',
    formId: string = '',
    dataCamunda: DeployCamundaResponse | undefined = undefined,
  ): string {
    const nameParent = dataCamunda
      ? this.toPascalCase(dataCamunda?.bpmnProcessId)
      : null;
    const oneToOneStr = nameParent
      ? `
  @OneToOne(() => ${nameParent}, {onDelete: 'CASCADE'})
  @JoinColumn()
  ${nameParent.toLowerCase()}: ${nameParent}; 
    `
      : ``;
    return `
  @Column('varchar', { length: 256, nullable: true, default: "${dataCamunda?.processDefinitionKey}" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, nullable: true, default: "${formId}" })
  formId: string;

  @Column({ type: 'text', nullable: true, default: '${JSON.stringify(processVariables)}' })
  processVariables: string;
  ${oneToOneStr}
  `;
  }

  private generateModelsServiceTask(
    serviceTaskElement: string[] = [],
    dataCamunda: DeployCamundaResponse | undefined = undefined,
    bpmnMessage: any = [],
  ): string {
    return `
  @Column('varchar', { length: 256, default: "${dataCamunda?.processDefinitionKey}" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, default: "${dataCamunda?.bpmnProcessId}" })
  bpmnProcessId: string = "${dataCamunda?.bpmnProcessId}";

  @Column({ type: 'integer', nullable: true, default: ${dataCamunda?.version} })
  version: number;

  @Column('varchar', { length: 256, nullable: true, default: "${dataCamunda?.resourceName}" })
  path_minio: string;

  @Column('varchar', { length: 256, nullable: true, default: "${serviceTaskElement.join()}" })
  servicesTask: string;

  @Column({ type: 'text', nullable: true, default: '${JSON.stringify(bpmnMessage)}' })
  messageServices: string;
  `;
  }

  private generateModels(
    moduleName: string,
    typeGenerate: string = '',
    processVariables: string = '',
    formId: string = '',
    serviceTaskElement: string[] = [],
    dataCamunda: DeployCamundaResponse | undefined = undefined,
    bpmnMessage: any = undefined,
  ): void {
    const moduleDir = this.generateFolder(moduleName, 'models');
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { ${typeGenerate === '' ? 'AbstractOrmEntity' : 'AbstractBpmnOrmEntity'} } from '@app/common';
import { ${typeGenerate === PROCESS ? 'Unique, ' : ''}Column, Entity${typeGenerate === USERTASK && dataCamunda?.bpmnProcessId ? ', OneToOne, JoinColumn' : ''} } from 'typeorm';
${typeGenerate === USERTASK && dataCamunda?.bpmnProcessId ? `import { ${this.toPascalCase(dataCamunda?.bpmnProcessId)} } from '../../${this.toPascalCase(dataCamunda?.bpmnProcessId).toLowerCase()}/models/${this.toPascalCase(dataCamunda?.bpmnProcessId).toLowerCase()}.entity';` : ''}

@Entity({
  name: '${moduleNameFilter.toLocaleLowerCase()}',
})
${typeGenerate === PROCESS && dataCamunda?.bpmnProcessId ? `@Unique(['processInstanceKey'])` : ''}
export class ${moduleNameFilter} extends ${typeGenerate === '' ? 'AbstractOrmEntity' : 'AbstractBpmnOrmEntity'}<${moduleNameFilter}> {
  ${typeGenerate === USERTASK ? this.generateModelsUserTask(processVariables, formId, dataCamunda) : ''}
  ${typeGenerate === PROCESS ? this.generateModelsServiceTask(serviceTaskElement, dataCamunda, bpmnMessage) : ''}
}

    `;

    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.entity.ts`),
      moduleContent.trim(),
    );
  }

  private generateRepository(
    moduleName: string,
    typeGenerate: string = '',
  ): void {
    const moduleDir = this.generateFolder(moduleName);
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Injectable, Logger } from '@nestjs/common';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLocaleLowerCase()}.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class ${moduleNameFilter}Repository extends AbstractOrmRepository<${moduleNameFilter}> {
  protected readonly logger = new Logger(${moduleNameFilter}Repository.name);

  constructor(
    @InjectRepository(${moduleNameFilter}) ${moduleNameFilter.toLocaleLowerCase()}Repository: Repository<${moduleNameFilter}>,
    entityManager: EntityManager,
  ) {
    super(${moduleNameFilter.toLocaleLowerCase()}Repository, entityManager);
  }
}

    `;
    fs.writeFileSync(
      path.resolve(
        moduleDir,
        `${moduleNameFilter.toLowerCase()}.repository.ts`,
      ),
      moduleContent.trim(),
    );
  }

  private generateModule(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName);
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Camunda8Service, DatabaseOrmModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLocaleLowerCase()}.entity';
import { ${moduleNameFilter}Controller } from './${moduleNameFilter.toLocaleLowerCase()}.controller';
import { ${moduleNameFilter}Service } from './${moduleNameFilter.toLocaleLowerCase()}.service';
import { ${moduleNameFilter}Repository } from './${moduleNameFilter.toLocaleLowerCase()}.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ORM_HOST: Joi.string().required(),
        ORM_PORT: Joi.number().required(),
        ORM_DATABASE: Joi.string().required(),
        ORM_USERNAME: Joi.string().required(),
        ORM_SYNC: Joi.boolean().required(),
      }),
    }),
    DatabaseOrmModule,
    DatabaseOrmModule.forFeature([${moduleNameFilter}]),
    LoggerModule,
  ],
  controllers: [${moduleNameFilter}Controller],
  providers: [
    ${moduleNameFilter}Service, 
    ${moduleNameFilter}Repository,
    Camunda8Service,
  ],
  exports: [${moduleNameFilter}Service],
})
export class ${moduleNameFilter}Module {}

    `;
    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.module.ts`),
      moduleContent.trim(),
    );
  }

  private generateController(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName);
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ${moduleNameFilter}Dto } from './dtos/${moduleNameFilter.toLowerCase()}.dto';
import { Serialize, FindDto, JwtAuthGuard } from '@app/common';
import { ${moduleNameFilter}Service } from './${moduleNameFilter.toLowerCase()}.service';
import { Create${moduleNameFilter}Dto } from './dtos/create-${moduleNameFilter.toLowerCase()}.dto';
import { Filter${moduleNameFilter}Dto } from './dtos/filter-${moduleNameFilter.toLowerCase()}.dto';
import { Update${moduleNameFilter}Dto } from './dtos/update-${moduleNameFilter.toLowerCase()}.dto';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLowerCase()}.entity';

@UseGuards(JwtAuthGuard)
@Controller('${moduleNameFilter.toLowerCase()}')
@ApiTags('${moduleNameFilter.toLowerCase()}')
@ApiBearerAuth()
export class ${moduleNameFilter}Controller {
  private fieldsSearching: (keyof ${moduleNameFilter})[] = [];
  private fieldsShowing: (keyof ${moduleNameFilter})[] = [];
  private nameRelations: string[] = [];

  constructor(private readonly ${moduleNameFilter.toLowerCase()}Service: ${moduleNameFilter}Service) {}

  @Post()
  @Serialize(${moduleNameFilter}Dto)
  async create(@Body() create${moduleNameFilter}Dto: Create${moduleNameFilter}Dto) {
    const entity = plainToClass(${moduleNameFilter}, create${moduleNameFilter}Dto);
    return this.${moduleNameFilter.toLowerCase()}Service.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filter${moduleNameFilter}Dto: Filter${moduleNameFilter}Dto) {
    const where = plainToClass(${moduleNameFilter}, {  });
    const nameTable = '${moduleNameFilter.toLowerCase()}';
    const searchColumns: (keyof ${moduleNameFilter})[] = this.fieldsSearching
    return this.${moduleNameFilter.toLowerCase()}Service.findByKeywordsWithPagination(
      filter${moduleNameFilter}Dto.page ?? 1,
      filter${moduleNameFilter}Dto.limit ?? 10,
      nameTable,
      filter${moduleNameFilter}Dto.keywords,
      searchColumns,
      where,
      this.nameRelations,
      filter${moduleNameFilter}Dto.order,
      this.fieldsShowing
    );
  }

  @Get('all')
  @Serialize(${moduleNameFilter}Dto)
  async findAll() {
    return this.${moduleNameFilter.toLowerCase()}Service.find({  });
  }

  @Get(':id')
  @Serialize(${moduleNameFilter}Dto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.findOne(findDto);
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filter${moduleNameFilter}Dto: Filter${moduleNameFilter}Dto,
  ) {
    return this.${moduleNameFilter.toLowerCase()}Service.findByWithPagination(
      filter${moduleNameFilter}Dto.page,
      filter${moduleNameFilter}Dto.limit,
      {  },
      this.nameRelations,
      filter${moduleNameFilter}Dto.order,
    );
  }

  @Patch(':id')
  @Serialize(${moduleNameFilter}Dto)
  async update(
    @Param('id') id: string,
    @Body() update${moduleNameFilter}Dto: Update${moduleNameFilter}Dto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.update(
      findDto, 
      update${moduleNameFilter}Dto, 
      this.nameRelations
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.remove(findDto);
  }
}


    `;
    fs.writeFileSync(
      path.resolve(
        moduleDir,
        `${moduleNameFilter.toLowerCase()}.controller.ts`,
      ),
      moduleContent.trim(),
    );
  }

  private generateService(moduleName: string, typeGenerate: string = ''): void {
    const moduleDir = this.generateFolder(moduleName);
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ${moduleNameFilter}Repository } from './${moduleNameFilter.toLowerCase()}.repository';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLocaleLowerCase()}.entity';
import { Camunda8Service, AbstractOrmService${typeGenerate === PROCESS ? ', ProcessModel' : ''}${typeGenerate === USERTASK ? ', SubmittableModel' : ''} } from '@app/common';

@Injectable()
export class ${moduleNameFilter}Service extends AbstractOrmService<${moduleNameFilter}>${typeGenerate === PROCESS ? ' implements ProcessModel' : ''}${typeGenerate === USERTASK ? ' implements SubmittableModel' : ''} {
  protected readonly repository: ${moduleNameFilter}Repository;

  constructor(
    ${moduleNameFilter.toLocaleLowerCase()}Repository: ${moduleNameFilter}Repository,
    private readonly camunda8Service: Camunda8Service,
  ) {
    super();
    this.repository = ${moduleNameFilter.toLocaleLowerCase()}Repository;
  }
  ${
    typeGenerate === PROCESS
      ? `async startProcess(entity: ${moduleNameFilter}): Promise<any> {
    // Implementasi logika untuk memulai proses
    try {
      const res = await this.camunda8Service.createProcessInstance({
        bpmnProcessId: entity.bpmnProcessId
      })
      return res
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  async startService(): Promise<void> {
    // Implementasi logika untuk memulai layanan
  }
    
  protected async beforeCreate(entity: ${moduleNameFilter}, extraData?: any): Promise<void> {
    const res = await this.startProcess(entity)
    entity.processDefinitionKey = res.processDefinitionKey;
    entity.bpmnProcessId = res.bpmnProcessId;
    entity.version = res.version;
    entity.processInstanceKey = res.processInstanceKey;
  }
  
  `
      : ''
  }
  ${
    typeGenerate === USERTASK
      ? `async submitTask(): Promise<void> {
    // Implementasi logika untuk memulai submit
  }

  `
      : ''
  }
}

    `;
    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.service.ts`),
      moduleContent.trim(),
    );
  }

  generateCrud(
    moduleName: string,
    bpmn: string = '',
    processVariables: string = '',
    formId: string = '',
    serviceTaskElement: string[] = [],
    dataCamunda: DeployCamundaResponse | undefined = undefined,
    bpmnMessage: any = undefined,
  ): void {
    this.generateFolder(moduleName);
    this.generateModels(
      moduleName,
      bpmn,
      processVariables,
      formId,
      serviceTaskElement,
      dataCamunda,
      bpmnMessage,
    );
    this.generateDtos(moduleName, bpmn);
    this.generateRepository(moduleName);
    this.generateService(moduleName, bpmn);
    this.generateController(moduleName);
    this.generateModule(moduleName);
  }
}
