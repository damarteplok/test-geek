import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubmitableFieldDto {
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
  processVariables: string;

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
    message: 'formId cannot be longer than 256 characters',
  })
  formId: string;

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
}
