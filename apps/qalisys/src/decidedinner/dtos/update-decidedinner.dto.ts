import { PartialType } from '@nestjs/swagger';
import { CreateDecideDinnerDto } from './create-decidedinner.dto';

export class UpdateDecideDinnerDto extends PartialType(CreateDecideDinnerDto){
  
}