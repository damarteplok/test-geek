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
import { PesenKeRestorantDto } from './dtos/pesenkerestorant.dto';
import { Serialize, FindDto, JwtAuthGuard } from '@app/common';
import { PesenKeRestorantService } from './pesenkerestorant.service';
import { CreatePesenKeRestorantDto } from './dtos/create-pesenkerestorant.dto';
import { FilterPesenKeRestorantDto } from './dtos/filter-pesenkerestorant.dto';
import { UpdatePesenKeRestorantDto } from './dtos/update-pesenkerestorant.dto';
import { PesenKeRestorant } from './models/pesenkerestorant.entity';

@UseGuards(JwtAuthGuard)
@Controller('pesenkerestorant')
@ApiTags('pesenkerestorant')
@ApiBearerAuth()
export class PesenKeRestorantController {
  constructor(private readonly pesenkerestorantService: PesenKeRestorantService) {}

  @Post()
  @Serialize(PesenKeRestorantDto)
  async create(@Body() createPesenKeRestorantDto: CreatePesenKeRestorantDto) {
    const entity = plainToClass(PesenKeRestorant, createPesenKeRestorantDto);
    return this.pesenkerestorantService.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filterPesenKeRestorantDto: FilterPesenKeRestorantDto) {
    const where = plainToClass(PesenKeRestorant, {  });
    const nameTable = 'pesenkerestorant';
    const searchColumns: (keyof PesenKeRestorant)[] = [
      
    ];
    return this.pesenkerestorantService.findByKeywordsWithPagination(
      filterPesenKeRestorantDto.page ?? 1,
      filterPesenKeRestorantDto.limit ?? 10,
      nameTable,
      filterPesenKeRestorantDto.keywords,
      searchColumns,
      where,
      [],
      filterPesenKeRestorantDto.order,
    );
  }

  @Get(':id')
  @Serialize(PesenKeRestorantDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.pesenkerestorantService.findOne(findDto);
  }

  @Get('all')
  @Serialize(PesenKeRestorantDto)
  async findAll() {
    return this.pesenkerestorantService.find({  });
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filterPesenKeRestorantDto: FilterPesenKeRestorantDto,
  ) {
    return this.pesenkerestorantService.findByWithPagination(
      filterPesenKeRestorantDto.page,
      filterPesenKeRestorantDto.limit,
      {  },
      [],
      filterPesenKeRestorantDto.order,
    );
  }

  @Patch(':id')
  @Serialize(PesenKeRestorantDto)
  async update(
    @Param('id') id: string,
    @Body() updatePesenKeRestorantDto: UpdatePesenKeRestorantDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.pesenkerestorantService.update(findDto, updatePesenKeRestorantDto, []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.pesenkerestorantService.remove(findDto);
  }
}