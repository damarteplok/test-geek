import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBarangDiskonDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    harga_barang: number;
  
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    diskon: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    diskon_rp: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    total_harga: number;
}