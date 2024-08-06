import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'minLength-{"ln":2,"count":2}',
  })
  @MaxLength(100, {
    message: 'maxLength-{"ln":100,"count":100}',
  })
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [Number], description: 'Array of permission IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  permissions: number[];
}
