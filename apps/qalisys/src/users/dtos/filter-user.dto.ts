import { CommonSearchFieldDto } from '@app/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { User } from '../models/user.entity';

export class FilterUserDto extends PartialType(CommonSearchFieldDto) {
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
  order: FindOptionsOrder<User>;
}
