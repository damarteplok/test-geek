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
import { Serialize } from '../interceptors';
import { FindDto } from '../dto';
import { JwtAuthGuard } from '../guards';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { RoleEntity } from './models/role.entity';

@UseGuards(JwtAuthGuard)
@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Serialize(RoleDto)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const roleEntity = plainToClass(RoleEntity, createRoleDto);

    return this.roleService.create(roleEntity);
  }

  @Get()
  async findAllPagination(@Query() filterRoleDto: FilterRoleDto) {
    const where = plainToClass(RoleEntity, {});
    const nameTable = 'role';
    const searchColumns: (keyof RoleEntity)[] = ['name', 'description'];
    return this.roleService.findByKeywordsWithPagination(
      filterRoleDto.page ?? 1,
      filterRoleDto.limit ?? 10,
      nameTable,
      filterRoleDto.keywords,
      searchColumns,
      where,
      [],
      filterRoleDto.order,
    );
  }

  @Get(':id')
  @Serialize(RoleDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.roleService.findOne(findDto);
  }

  @Get('all')
  @Serialize(RoleDto)
  async findAll() {
    return this.roleService.find({});
  }

  // searching with post biasa dipake utk advance searching
  @Post('search')
  async findEntityAllPagination(@Body() filterRoleDto: FilterRoleDto) {
    const { name, description } = filterRoleDto;
    return this.roleService.findByWithPagination(
      filterRoleDto.page,
      filterRoleDto.limit,
      { name, description },
      [],
      filterRoleDto.order,
    );
  }

  @Patch(':id')
  @Serialize(RoleDto)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.roleService.update(findDto, updateRoleDto, []);
  }

  @Delete(':id')
  @Serialize(RoleDto)
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.roleService.remove(findDto);
  }
}
