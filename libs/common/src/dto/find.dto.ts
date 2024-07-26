import { IsNumber } from 'class-validator';

export class FindDto {
  @IsNumber()
  id: number;
}
