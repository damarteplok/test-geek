import { PartialType } from '@nestjs/swagger';
import { CreatePesenKeRestorantDto } from './create-pesenkerestorant.dto';

export class UpdatePesenKeRestorantDto extends PartialType(CreatePesenKeRestorantDto){
  
}