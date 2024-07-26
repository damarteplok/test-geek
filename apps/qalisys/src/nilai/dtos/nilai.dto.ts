import { Expose } from 'class-transformer';

export class NilaiDto {
  @Expose()
  id: number;

  @Expose()
  nilai_1: number;

  @Expose()
  nilai_2: number;

  @Expose()
  nilai_3: number;

  @Expose()
  rata_rata: number;

  @Expose()
  lulus: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}