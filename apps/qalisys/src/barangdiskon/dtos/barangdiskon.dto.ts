import { Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class BarangDiskonDto {
  @Expose()
  id: number;

  @Expose()
  harga_barang: number;

  @Expose()
  diskon: number;

  @Expose()
  diskon_rp: number;

  @Expose()
  total_harga: number;

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
