import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class IncludeVariable {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  alwaysReturnFullValue: boolean;
}

export class TaskVariablesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variableNames: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludeVariable)
  includeVariable: IncludeVariable[];
}
