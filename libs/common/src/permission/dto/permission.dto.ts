import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { RoleDto } from '../../role/dto/role.dto';

export const basicFieldGroupsForSerializing: string[] = ['basic'];

export class PermissionDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  resource: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  path: string;

  @ApiProperty()
  @Expose()
  method: string;

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiProperty()
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  created_at: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  updated_at: Date;
}
