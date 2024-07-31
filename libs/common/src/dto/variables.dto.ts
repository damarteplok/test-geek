import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class DraftVariables {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  value: string;
}

export class VariablesDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftVariables)
  variables: DraftVariables[];
}
