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
import { NamaNimService } from './namanim.service';
import { CreateNamaNimDto } from './dtos/create-namanim.dto';
import { FindDto, Serialize } from '@app/common';
import { NamaNimDto } from './dtos/namanim.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateNamaNimDto } from './dtos/update-namanim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('namanim')
@UseGuards(JwtAuthGuard)
@Serialize(NamaNimDto)
@ApiTags('namanim')
export class NamaNimController {
  constructor(private readonly namanimService: NamaNimService) {}

  @Post()
  async create(@Body() createNamaNimDto: CreateNamaNimDto) {
    //create karakter_empat
    let karakter_empat = '';
    if (createNamaNimDto.nama.length > 6) {
      karakter_empat = createNamaNimDto.nama.substring(3, 3 + 4);
    }
    return this.namanimService.create({
      ...createNamaNimDto,
      karakter_empat,
    });
  }

  @Get()
  async findAll() {
    return this.namanimService.find({ deleted_at: null });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.namanimService.findOne(findDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNamaNimDto: UpdateNamaNimDto,
  ) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.namanimService.update(findDto, updateNamaNimDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.namanimService.remove(findDto);
  }
}
