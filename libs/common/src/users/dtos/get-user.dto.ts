import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
