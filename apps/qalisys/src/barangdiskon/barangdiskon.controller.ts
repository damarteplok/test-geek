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
import { BarangDiskonService } from './barangdiskon.service';
import { CreateBarangDiskonDto } from './dtos/create-barangdiskon.dto';
import { FindDto, Serialize } from '@app/common';
import { BarangDiskonDto } from './dtos/barangdiskon.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateBarangDiskonDto } from './dtos/update-barangdiskon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('barangdiskon')
@Serialize(BarangDiskonDto)
@UseGuards(JwtAuthGuard)
@ApiTags('barangdiskon')
export class BarangDiskonController {
  constructor(private readonly barangdiskonService: BarangDiskonService) {}

  @Post()
  async create(@Body() createBarangDiskonDto: CreateBarangDiskonDto) {
    //create karakter_empat
    let diskon_rp =
      createBarangDiskonDto.harga_barang * (createBarangDiskonDto.diskon / 100);
    let total_harga = createBarangDiskonDto.harga_barang - diskon_rp;

    return this.barangdiskonService.create({
      ...createBarangDiskonDto,
      diskon_rp,
      total_harga,
    });
  }

  @Get()
  async findAll() {
    return this.barangdiskonService.find({ deleted_at: null });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.barangdiskonService.findOne(findDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBarangDiskonDto: UpdateBarangDiskonDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.barangdiskonService.update(findDto, updateBarangDiskonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.barangdiskonService.remove(findDto);
  }
}
