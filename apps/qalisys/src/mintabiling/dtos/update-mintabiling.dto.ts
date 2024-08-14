import { PartialType } from '@nestjs/swagger';
import { CreateMintaBilingDto } from './create-mintabiling.dto';

export class UpdateMintaBilingDto extends PartialType(CreateMintaBilingDto){
  
}