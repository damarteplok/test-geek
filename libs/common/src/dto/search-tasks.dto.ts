import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class FromToDate {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to: Date;
}

class TaskVariables {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  operator: string;
}

export class SearchTasksDto {
  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsBoolean()
  assigned: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignees: string[];

  @IsOptional()
  @IsString()
  taskDefinitionId: string;

  @IsOptional()
  @IsString()
  candidateGroup: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  candidateGroups: string[];

  @IsOptional()
  @IsString()
  candidateUser: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  candidateUsers: string[];

  @IsOptional()
  @IsString()
  processDefinitionKey: string;

  @IsOptional()
  @IsString()
  processInstanceKey: string;

  @IsOptional()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tenantIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchAfter: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchAfterOrEqual: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchBefore: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchBeforeOrEqual: string[];

  @IsOptional()
  @IsString()
  implementation: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => FromToDate)
  followUpDate: FromToDate;

  @ValidateNested()
  @IsOptional()
  @Type(() => FromToDate)
  dueDate: FromToDate;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TaskVariables)
  taskVariables: TaskVariables[];
}
