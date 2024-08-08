import {
  IsNumber,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Filter {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  key: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  version: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bpmnProcessId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  processInstanceKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  processDefinitionKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  processVersion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tenantId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  incident: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  flowNodeId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  flowNodeName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  decisionId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  decisionDefinitionId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  decisionName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  decisionRequirementsId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  decisionRequirementsName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  decisionRequirementsKey: number;
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
