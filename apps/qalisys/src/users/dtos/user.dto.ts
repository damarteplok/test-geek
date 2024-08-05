import { UserStatusEnum } from '@app/common';
import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  contact: string;

  @Expose()
  avatar: string;

  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  status: UserStatusEnum;

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  created_at: Date;

  @Expose()
  @Transform(({ value }) =>
    DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm'),
  )
  updated_at: Date;

  @Expose()
  roleId: number;
}
