import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

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
}
