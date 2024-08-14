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
import { MintaBilingDto } from './dtos/mintabiling.dto';
import { Serialize, FindDto, JwtAuthGuard } from '@app/common';
import { MintaBilingService } from './mintabiling.service';
import { CreateMintaBilingDto } from './dtos/create-mintabiling.dto';
import { FilterMintaBilingDto } from './dtos/filter-mintabiling.dto';
import { UpdateMintaBilingDto } from './dtos/update-mintabiling.dto';
import { MintaBiling } from './models/mintabiling.entity';

@UseGuards(JwtAuthGuard)
@Controller('mintabiling')
@ApiTags('mintabiling')
@ApiBearerAuth()
export class MintaBilingController {
  constructor(private readonly mintabilingService: MintaBilingService) {}

  @Post()
  @Serialize(MintaBilingDto)
  async create(@Body() createMintaBilingDto: CreateMintaBilingDto) {
    const entity = plainToClass(MintaBiling, createMintaBilingDto);
    return this.mintabilingService.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filterMintaBilingDto: FilterMintaBilingDto) {
    const where = plainToClass(MintaBiling, {  });
    const nameTable = 'mintabiling';
    const searchColumns: (keyof MintaBiling)[] = [
      
    ];
    return this.mintabilingService.findByKeywordsWithPagination(
      filterMintaBilingDto.page ?? 1,
      filterMintaBilingDto.limit ?? 10,
      nameTable,
      filterMintaBilingDto.keywords,
      searchColumns,
      where,
      [],
      filterMintaBilingDto.order,
    );
  }

  @Get(':id')
  @Serialize(MintaBilingDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.mintabilingService.findOne(findDto);
  }

  @Get('all')
  @Serialize(MintaBilingDto)
  async findAll() {
    return this.mintabilingService.find({  });
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filterMintaBilingDto: FilterMintaBilingDto,
  ) {
    return this.mintabilingService.findByWithPagination(
      filterMintaBilingDto.page,
      filterMintaBilingDto.limit,
      {  },
      [],
      filterMintaBilingDto.order,
    );
  }

  @Patch(':id')
  @Serialize(MintaBilingDto)
  async update(
    @Param('id') id: string,
    @Body() updateMintaBilingDto: UpdateMintaBilingDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.mintabilingService.update(findDto, updateMintaBilingDto, []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.mintabilingService.remove(findDto);
  }
}