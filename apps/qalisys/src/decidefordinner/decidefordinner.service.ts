import { Injectable } from '@nestjs/common';
import { DecideForDinnerRepository } from './decidefordinner.repository';
import { DecideForDinner } from './models/decidefordinner.entity';
import { AbstractOrmService } from '@app/common';

@Injectable()
export class DecideForDinnerService extends AbstractOrmService<DecideForDinner> {
  protected readonly repository: DecideForDinnerRepository;

  constructor(decidefordinnerRepository: DecideForDinnerRepository) {
    super();
    this.repository = decidefordinnerRepository;
  }
}