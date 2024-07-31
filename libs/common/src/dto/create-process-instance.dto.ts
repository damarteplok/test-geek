import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProcessInstanceDto {
  @IsString()
  bpmnProcessId: string;

  @IsOptional()
  @IsObject()
  @Type(() => Object)
  variables?: Record<string, any>;
}
