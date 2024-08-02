import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommonSearchFieldDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  page: number;
}
