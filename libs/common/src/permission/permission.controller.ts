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
import { PermissionDto } from './dto/permission.dto';
import { Serialize } from '../interceptors';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FilterPermissionDto } from './dto/filter-permission.dto';
import { FindDto } from '../dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../guards';
import { PermissionEntity } from './models/permission.entity';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
@ApiTags('permissions')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Serialize(PermissionDto)
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const entity = plainToClass(PermissionEntity, createPermissionDto);
    return this.permissionService.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filterPermissionDto: FilterPermissionDto) {
    const where = plainToClass(PermissionEntity, {});
    const nameTable = 'permission';
    const searchColumns: (keyof PermissionEntity)[] = [
      'resource',
      'description',
    ];
    return this.permissionService.findByKeywordsWithPagination(
      filterPermissionDto.page ?? 1,
      filterPermissionDto.limit ?? 10,
      nameTable,
      filterPermissionDto.keywords,
      searchColumns,
      where,
      ['role'],
      filterPermissionDto.order,
    );
  }

  @Get(':id')
  @Serialize(PermissionDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.permissionService.findOne(findDto, ['role']);
  }

  @Get('all')
  @Serialize(PermissionDto)
  async findAll() {
    const where = plainToClass(PermissionEntity, {});
    return this.permissionService.findWithRelations(where, ['role']);
  }

  // searching with post biasa dipake utk advance searching
  @Post('search')
  async findEntityAllPagination(
    @Body() filterPermissionDto: FilterPermissionDto,
  ) {
    const { resource, description } = filterPermissionDto;
    return this.permissionService.findByWithPagination(
      filterPermissionDto.page,
      filterPermissionDto.limit,
      { resource, description },
      ['role'],
      filterPermissionDto.order,
    );
  }

  @Patch(':id')
  @Serialize(PermissionDto)
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.permissionService.update(findDto, updatePermissionDto, []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.permissionService.remove(findDto);
  }
}
