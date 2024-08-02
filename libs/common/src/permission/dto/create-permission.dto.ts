import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { PermissionEntity } from '../models/permission.entity';
import { IsUnique } from '../../pipes/unique-validator.pipe';
import { MethodList } from '../../config';
import { ApiProperty } from '@nestjs/swagger';

const methodListArray = [
  MethodList.ANY,
  MethodList.DELETE,
  MethodList.GET,
  MethodList.POST,
  MethodList.PUT,
  MethodList.OPTIONS,
];

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'maxLength-{"ln":50,"count":50}',
  })
  resource: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUnique(PermissionEntity, 'description', {
    message: 'description already exists',
  })
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'maxLength-{"ln":50,"count":50}',
  })
  path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(methodListArray, {
    message: `isIn-{"items":"${methodListArray.join(',')}"}`,
  })
  method: MethodList;
}
