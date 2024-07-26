import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateChooseDinnerDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    process_instance_id: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    business_key: string;
}