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
import { NilaiService } from './nilai.service';
import { CreateNilaiDto } from './dtos/create-nilai.dto';
import { FindDto, Serialize } from '@app/common';
import { NilaiDto } from './dtos/nilai.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateNilaiDto } from './dtos/update-nilai.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('nilai')
@Serialize(NilaiDto)
@ApiTags('nilai')
export class NilaiController {
  constructor(private readonly nilaiService: NilaiService) {}

  @Post()
  async create(@Body() createNilaiDto: CreateNilaiDto) {
    let rata_rata =
      (createNilaiDto.nilai_1 +
        createNilaiDto.nilai_2 +
        createNilaiDto.nilai_3) /
      3;
    let lulus = rata_rata >= 60 ? 'LULUS' : 'GAGAL';
    return this.nilaiService.create({ ...createNilaiDto, rata_rata, lulus });
  }

  @Get()
  async findAll() {
    return this.nilaiService.find({ deleted_at: null });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.nilaiService.findOne(findDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNilaiDto: UpdateNilaiDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.nilaiService.update(findDto, updateNilaiDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.nilaiService.remove(findDto);
  }
}
