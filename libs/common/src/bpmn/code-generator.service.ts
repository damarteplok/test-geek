import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

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

  private generateDtos(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName, 'dtos');
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class ${moduleNameFilter}Dto {
  @Expose()
  id: number;

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

export class Create${moduleNameFilter}Dto {
  
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

export class Update${moduleNameFilter}Dto {
  
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
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommonSearchFieldDto } from '@app/common';
import { FindOptionsOrder } from 'typeorm';
import { ${moduleNameFilter} } from '../models/${moduleNameFilter.toLowerCase()}.entity';

export class Filter${moduleNameFilter}Dto extends PartialType(CommonSearchFieldDto) {
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

  private generateModels(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName, 'models');
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity({
  name: '${moduleNameFilter.toLocaleLowerCase()}',
})
export class ${moduleNameFilter} extends AbstractOrmEntity<${moduleNameFilter}> {
  @Column({ type: 'varchar', nullable: true })
  process_instance_id: string;

  @Column({ type: 'varchar', nullable: true })
  process_definition_id: string;

  @Column({ type: 'varchar', nullable: true })
  business_key: string;
}

    `;

    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.entity.ts`),
      moduleContent.trim(),
    );
  }

  private generateRepository(moduleName: string): void {
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
import { DatabaseOrmModule, LoggerModule } from '@app/common';
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
  providers: [${moduleNameFilter}Service, ${moduleNameFilter}Repository],
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
    const searchColumns: (keyof ${moduleNameFilter})[] = [
      
    ];
    return this.${moduleNameFilter.toLowerCase()}Service.findByKeywordsWithPagination(
      filter${moduleNameFilter}Dto.page ?? 1,
      filter${moduleNameFilter}Dto.limit ?? 10,
      nameTable,
      filter${moduleNameFilter}Dto.keywords,
      searchColumns,
      where,
      [],
      filter${moduleNameFilter}Dto.order,
    );
  }

  @Get(':id')
  @Serialize(${moduleNameFilter}Dto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.findOne(findDto);
  }

  @Get('all')
  @Serialize(${moduleNameFilter}Dto)
  async findAll() {
    return this.${moduleNameFilter.toLowerCase()}Service.find({  });
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filter${moduleNameFilter}Dto: Filter${moduleNameFilter}Dto,
  ) {
    return this.${moduleNameFilter.toLowerCase()}Service.findByWithPagination(
      filter${moduleNameFilter}Dto.page,
      filter${moduleNameFilter}Dto.limit,
      {  },
      [],
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
    return this.${moduleNameFilter.toLowerCase()}Service.update(findDto, update${moduleNameFilter}Dto, []);
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

  private generateService(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName);
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { Injectable } from '@nestjs/common';
import { ${moduleNameFilter}Repository } from './${moduleNameFilter.toLowerCase()}.repository';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLocaleLowerCase()}.entity';
import { AbstractOrmService } from '@app/common';

@Injectable()
export class ${moduleNameFilter}Service extends AbstractOrmService<${moduleNameFilter}> {
  protected readonly repository: ${moduleNameFilter}Repository;

  constructor(${moduleNameFilter.toLocaleLowerCase()}Repository: ${moduleNameFilter}Repository) {
    super();
    this.repository = ${moduleNameFilter.toLocaleLowerCase()}Repository;
  }
}

    `;
    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.service.ts`),
      moduleContent.trim(),
    );
  }

  generateCrud(moduleName: string): void {
    this.generateFolder(moduleName);
    this.generateModels(moduleName);
    this.generateDtos(moduleName);
    this.generateRepository(moduleName);
    this.generateService(moduleName);
    this.generateController(moduleName);
    this.generateModule(moduleName);
  }
}
