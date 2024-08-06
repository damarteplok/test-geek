import { DateTime } from 'luxon';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { PermissionDto } from '../../permission/dto/permission.dto';
import { UserDto } from '../../users/dtos/user.dto';

export const adminUserGroupsForSerializing: string[] = ['admin'];
export const basicFieldGroupsForSerializing: string[] = ['basic'];

export class RoleDto {
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description: string;

  @ApiProperty({ type: [PermissionDto] })
  @Expose()
  @Type(() => PermissionDto)
  permission: PermissionDto[];

  @ApiProperty({ type: [UserDto] })
  @Expose()
  @Type(() => UserDto)
  user: UserDto[];

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
