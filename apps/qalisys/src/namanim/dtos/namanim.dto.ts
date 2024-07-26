import { Expose } from 'class-transformer';

export class NamaNimDto {
  @Expose()
  id: number;

  @Expose()
  nama: string;

  @Expose()
  nim: string;

  @Expose()
  karakter_empat: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}