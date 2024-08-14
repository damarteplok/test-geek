import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CommonSearchFieldDto } from '@app/common';
import { FindOptionsOrder } from 'typeorm';
import { MintaBiling } from '../models/mintabiling.entity';

export class FilterMintaBilingDto extends PartialType(CommonSearchFieldDto) {
  @ApiPropertyOptional({
    type: 'processDefinitionKey',
    description:
      'Search by processDefinitionKey, e.g., { "processDefinitionKey": "xxxx" }',
  })
  @IsOptional()
  @IsString()
  processDefinitionKey: string;

  @ApiPropertyOptional({
    type: 'processInstanceKey',
    description:
      'Search by processInstanceKey, e.g., { "processInstanceKey": "xxxx" }',
  })
  @IsOptional()
  @IsString()
  processInstanceKey: string;
  
  @ApiPropertyOptional({
    type: Object,
    description:
      'Order by fields, e.g., { "name": "ASC", "created_at": "DESC" }',
  })
  @IsOptional()
  order: FindOptionsOrder<MintaBiling>;
}