import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommonSearchFieldDto {
  @ApiPropertyOptional({
    type: 'keywords',
    description: 'Search by keywords, e.g., { "keywords": "xxxx" }',
    required: false,
  })
  @IsOptional()
  @IsString()
  keywords: string;

  @ApiPropertyOptional({
    type: 'limit',
    description: 'Search by limit, e.g., { "limit": "xxxx" }',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  limit: number;

  @ApiPropertyOptional({
    name: 'page',
    description: 'Search by limit, e.g., { "page": "xxxx" }',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  page: number;
}
