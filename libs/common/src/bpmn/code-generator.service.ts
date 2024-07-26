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
import { Expose } from 'class-transformer';

export class ${moduleNameFilter}Dto {
  @Expose()
  id: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
    `;

    fs.writeFileSync(
      path.resolve(moduleDir, `${moduleNameFilter.toLowerCase()}.dto.ts`),
      moduleContent.trim(),
    );

    const moduleContentCreate = `
import { ApiProperty } from '@nestjs/swagger';

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
import { ApiProperty } from '@nestjs/swagger';

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
  }

  private generateModels(moduleName: string): void {
    const moduleDir = this.generateFolder(moduleName, 'models');
    const moduleNameFilter = this.toPascalCase(moduleName);
    const moduleContent = `
import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class ${moduleNameFilter} extends AbstractOrmEntity<${moduleNameFilter}> {
  @Column()
  process_instance_id: string;

  @Column()
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
  UseGuards,
} from '@nestjs/common';
import { ${moduleNameFilter}Service } from './${moduleNameFilter.toLowerCase()}.service';
import { Create${moduleNameFilter}Dto } from './dtos/create-${moduleNameFilter.toLowerCase()}.dto';
import { FindDto, Serialize } from '@app/common';
import { ${moduleNameFilter}Dto } from './dtos/${moduleNameFilter.toLowerCase()}.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Update${moduleNameFilter}Dto } from './dtos/update-${moduleNameFilter.toLowerCase()}.dto';

@Controller('${moduleNameFilter.toLowerCase()}')
@Serialize(${moduleNameFilter}Dto)
@ApiTags('${moduleNameFilter.toLowerCase()}')
export class ${moduleNameFilter}Controller {
  constructor(private readonly ${moduleNameFilter.toLowerCase()}Service: ${moduleNameFilter}Service) {}

  @Post()
  async create(@Body() create${moduleNameFilter}Dto: Create${moduleNameFilter}Dto) {
    return this.${moduleNameFilter.toLowerCase()}Service.create(create${moduleNameFilter}Dto);
  }

  @Get()
  async findAll() {
    return this.${moduleNameFilter.toLowerCase()}Service.find({ deleted_at: null });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.findOne(findDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() update${moduleNameFilter}Dto: Update${moduleNameFilter}Dto) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.${moduleNameFilter.toLowerCase()}Service.update(findDto, update${moduleNameFilter}Dto);
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
import { FindDto } from '@app/common';
import { Create${moduleNameFilter}Dto } from './dtos/create-${moduleNameFilter.toLowerCase()}.dto';
import { ${moduleNameFilter} } from './models/${moduleNameFilter.toLowerCase()}.entity';

@Injectable()
export class ${moduleNameFilter}Service {
  constructor(private readonly ${moduleNameFilter.toLowerCase()}Repository: ${moduleNameFilter}Repository) {}

  async create(create${moduleNameFilter}Dto: Create${moduleNameFilter}Dto) {
    const ${moduleNameFilter.toLowerCase()} = new ${moduleNameFilter}({
      ...create${moduleNameFilter}Dto,
    });
    return this.${moduleNameFilter.toLowerCase()}Repository.create(${moduleNameFilter.toLowerCase()});
  }

  async find(attrs: Partial<${moduleNameFilter}>) {
    return this.${moduleNameFilter.toLowerCase()}Repository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.${moduleNameFilter.toLowerCase()}Repository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<${moduleNameFilter}>) {
    return this.${moduleNameFilter.toLowerCase()}Repository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.${moduleNameFilter.toLowerCase()}Repository.findOneAndDelete({ ...attr });
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
    this.generateDtos(moduleName);
    this.generateModels(moduleName);
    this.generateRepository(moduleName);
    this.generateService(moduleName);
    this.generateController(moduleName);
    this.generateModule(moduleName);
  }
}
