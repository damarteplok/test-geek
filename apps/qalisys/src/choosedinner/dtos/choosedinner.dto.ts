import { Expose } from 'class-transformer';

export class ChooseDinnerDto {
  @Expose()
  id: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}