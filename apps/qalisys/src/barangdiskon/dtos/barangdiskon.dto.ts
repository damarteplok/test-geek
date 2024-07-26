import { Expose } from 'class-transformer';

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
  created_at: Date;

  @Expose()
  updated_at: Date;
}