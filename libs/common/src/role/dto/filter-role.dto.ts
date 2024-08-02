import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CommonSearchFieldDto } from '../../dto';
import { FindOptionsOrder } from 'typeorm';
import { RoleEntity } from '../models/role.entity';

export class FilterRoleDto extends PartialType(CommonSearchFieldDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'minLength-{"ln":2,"count":2}',
  })
  @MaxLength(100, {
    message: 'maxLength-{"ln":100,"count":100}',
  })
  name: string;

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
  order: FindOptionsOrder<RoleEntity>;
}
