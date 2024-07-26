import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNamaNimDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    nama: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    nim: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    karakter_empat: string;
}