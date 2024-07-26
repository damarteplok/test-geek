import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNamaNimDto {
    @ApiProperty()
    @IsString()
    nama: string;
  
    @ApiProperty()
    @IsString()
    nim: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    karakter_empat: string;
}