import { UserStatusEnum } from '@app/common';
import { RoleDto } from '@app/common/role/dto/role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  contact: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  status: UserStatusEnum;

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
  
  @ApiProperty({ type: [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto[];

  // @Expose()
  // roleId: number;
}
