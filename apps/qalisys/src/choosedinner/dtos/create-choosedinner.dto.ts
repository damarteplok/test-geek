import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChooseDinnerDto {
  @ApiProperty()
  @IsString()
  process_instance_id: string;

  @ApiProperty()
  @IsString()
  business_key: string;
}
