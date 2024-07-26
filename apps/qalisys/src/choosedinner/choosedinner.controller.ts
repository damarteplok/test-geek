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
import { ChooseDinnerService } from './choosedinner.service';
import { CreateChooseDinnerDto } from './dtos/create-choosedinner.dto';
import { FindDto, Serialize } from '@app/common';
import { ChooseDinnerDto } from './dtos/choosedinner.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateChooseDinnerDto } from './dtos/update-choosedinner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('choosedinner')
@UseGuards(JwtAuthGuard)
@Serialize(ChooseDinnerDto)
@ApiTags('choosedinner')
export class ChooseDinnerController {
  constructor(private readonly choosedinnerService: ChooseDinnerService) {}

  @Post()
  async create(@Body() createChooseDinnerDto: CreateChooseDinnerDto) {
    return this.choosedinnerService.create(createChooseDinnerDto);
  }

  @Get()
  async findAll() {
    return this.choosedinnerService.find({ deleted_at: null });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.choosedinnerService.findOne(findDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChooseDinnerDto: UpdateChooseDinnerDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.choosedinnerService.update(findDto, updateChooseDinnerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.choosedinnerService.remove(findDto);
  }
}
