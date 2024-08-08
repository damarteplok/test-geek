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
import { DecideForDinnerDto } from './dtos/decidefordinner.dto';
import { Serialize, FindDto, JwtAuthGuard } from '@app/common';
import { DecideForDinnerService } from './decidefordinner.service';
import { CreateDecideForDinnerDto } from './dtos/create-decidefordinner.dto';
import { FilterDecideForDinnerDto } from './dtos/filter-decidefordinner.dto';
import { UpdateDecideForDinnerDto } from './dtos/update-decidefordinner.dto';
import { DecideForDinner } from './models/decidefordinner.entity';

@UseGuards(JwtAuthGuard)
@Controller('decidefordinner')
@ApiTags('decidefordinner')
@ApiBearerAuth()
export class DecideForDinnerController {
  constructor(private readonly decidefordinnerService: DecideForDinnerService) {}

  @Post()
  @Serialize(DecideForDinnerDto)
  async create(@Body() createDecideForDinnerDto: CreateDecideForDinnerDto) {
    const entity = plainToClass(DecideForDinner, createDecideForDinnerDto);
    return this.decidefordinnerService.create(entity);
  }

  @Get()
  async findAllPagination(@Query() filterDecideForDinnerDto: FilterDecideForDinnerDto) {
    const where = plainToClass(DecideForDinner, {  });
    const nameTable = 'decidefordinner';
    const searchColumns: (keyof DecideForDinner)[] = [
      
    ];
    return this.decidefordinnerService.findByKeywordsWithPagination(
      filterDecideForDinnerDto.page ?? 1,
      filterDecideForDinnerDto.limit ?? 10,
      nameTable,
      filterDecideForDinnerDto.keywords,
      searchColumns,
      where,
      [],
      filterDecideForDinnerDto.order,
    );
  }

  @Get(':id')
  @Serialize(DecideForDinnerDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidefordinnerService.findOne(findDto);
  }

  @Get('all')
  @Serialize(DecideForDinnerDto)
  async findAll() {
    return this.decidefordinnerService.find({  });
  }

  @Post('search')
  async findEntityAllPagination(
    @Body() filterDecideForDinnerDto: FilterDecideForDinnerDto,
  ) {
    return this.decidefordinnerService.findByWithPagination(
      filterDecideForDinnerDto.page,
      filterDecideForDinnerDto.limit,
      {  },
      [],
      filterDecideForDinnerDto.order,
    );
  }

  @Patch(':id')
  @Serialize(DecideForDinnerDto)
  async update(
    @Param('id') id: string,
    @Body() updateDecideForDinnerDto: UpdateDecideForDinnerDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidefordinnerService.update(findDto, updateDecideForDinnerDto, []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.decidefordinnerService.remove(findDto);
  }
}