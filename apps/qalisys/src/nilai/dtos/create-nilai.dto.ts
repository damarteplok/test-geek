import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNilaiDto {
    @ApiProperty()
    @IsNumber()
    nilai_1: number;

    @ApiProperty()
    @IsNumber()
    nilai_2: number;

    @ApiProperty()
    @IsNumber()
    nilai_3: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    rata_rata: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lulus: string;
}