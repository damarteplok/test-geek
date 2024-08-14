import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProcessFieldDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'processDefinitionKey cannot be longer than 256 characters',
  })
  processDefinitionKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'bpmnProcessId cannot be longer than 256 characters',
  })
  bpmnProcessId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'version must number' })
  version: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'path_minio cannot be longer than 256 characters',
  })
  path_minio: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'servicesTask cannot be longer than 256 characters',
  })
  servicesTask: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'messageServices cannot be longer than 256 characters',
  })
  messageServices: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'path_minio cannot be longer than 256 characters',
  })
  processInstanceKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'taskDefinitionId cannot be longer than 256 characters',
  })
  taskDefinitionId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(256, {
    message: 'taskId cannot be longer than 256 characters',
  })
  taskId: string;

  @IsOptional()
  @IsObject()
  @Type(() => Object)
  variables?: Record<string, any>;
}
