import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CommonSearchFieldDto } from '../../dto';
import { FindOptionsOrder } from 'typeorm';
import { PermissionEntity } from '../models/permission.entity';

export class FilterPermissionDto extends PartialType(CommonSearchFieldDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'maxLength-{"ln":50,"count":50}',
  })
  resource: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: Object,
    description:
      'Order by fields, e.g., { "name": "ASC", "created_at": "DESC" }',
  })
  @IsOptional()
  order: FindOptionsOrder<PermissionEntity>;
}
