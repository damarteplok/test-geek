import {
  IsNumber,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class Filter {
  @IsNumber()
  @IsOptional()
  key: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  version: number;

  @IsString()
  @IsOptional()
  bpmnProcessId: string;

  @IsString()
  @IsOptional()
  tenantId: string;
}

class Sort {
  @IsString()
  @IsOptional()
  field: string;

  @IsString()
  @IsOptional()
  order: 'ASC' | 'DESC';
}

export class SearchProcessDefinitionDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Filter)
  filter: Filter;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  searchAfter: object[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Sort)
  sort: Sort[];
}
