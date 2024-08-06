import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { User } from '../models/user.entity';
import { CommonSearchFieldDto } from '../../dto/common-search-field.dto';

export class FilterUserDto extends PartialType(CommonSearchFieldDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'maxLength-{"ln":256,"count":256}',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'maxLength-{"ln":256,"count":256}',
  })
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'maxLength-{"ln":256,"count":256}',
  })
  contact: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'maxLength-{"ln":256,"count":256}',
  })
  status: string;

  @ApiPropertyOptional({
    type: Object,
    description:
      'Order by fields, e.g., { "name": "ASC", "created_at": "DESC" }',
  })
  @IsOptional()
  order: FindOptionsOrder<User>;
}
