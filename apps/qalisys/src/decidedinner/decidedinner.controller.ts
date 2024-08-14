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
import { DecideDinnerDto } from './dtos/decidedinner.dto';
import { Serialize, FindDto, JwtAuthGuard } from '@app/common';
import { DecideDinnerService } from './decidedinner.service';
import { CreateDecideDinnerDto } from './dtos/create-decidedinner.dto';
import { FilterDecideDinnerDto } from './dtos/filter-decidedinner.dto';
import { UpdateDecideDinnerDto } from './dtos/update-decidedinner.dto';
import { DecideDinner } from './models/decidedinner.entity';

@UseGuards(JwtAuthGuard)
@Controller('decidedinner')
@ApiTags('decidedinner')
@ApiBearerAuth()
export class DecideDinnerController {
  constructor(private readonly decidedinnerService: DecideDinnerService) {}

  @Post()
  @Serialize(DecideDinnerDto)
  async create(@Body() createDecideDinnerDto: CreateDecideDinnerDto) {
    const entity = plainToClass(DecideDinner, createDecideDinnerDto);
    return this.decidedinnerService.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filterDecideDinnerDto: FilterDecideDinnerDto) {
    const where = plainToClass(DecideDinner, {  });
    const nameTable = 'decidedinner';
    const searchColumns: (keyof DecideDinner)[] = [
      
    ];
    return this.decidedinnerService.findByKeywordsWithPagination(
      filterDecideDinnerDto.page ?? 1,
      filterDecideDinnerDto.limit ?? 10,
      nameTable,
      filterDecideDinnerDto.keywords,
      searchColumns,
      where,
      [],
      filterDecideDinnerDto.order,
    );
  }

  @Get(':id')
  @Serialize(DecideDinnerDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidedinnerService.findOne(findDto);
  }

  @Get('all')
  @Serialize(DecideDinnerDto)
  async findAll() {
    return this.decidedinnerService.find({  });
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filterDecideDinnerDto: FilterDecideDinnerDto,
  ) {
    return this.decidedinnerService.findByWithPagination(
      filterDecideDinnerDto.page,
      filterDecideDinnerDto.limit,
      {  },
      [],
      filterDecideDinnerDto.order,
    );
  }

  @Patch(':id')
  @Serialize(DecideDinnerDto)
  async update(
    @Param('id') id: string,
    @Body() updateDecideDinnerDto: UpdateDecideDinnerDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidedinnerService.update(findDto, updateDecideDinnerDto, []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidedinnerService.remove(findDto);
  }
}