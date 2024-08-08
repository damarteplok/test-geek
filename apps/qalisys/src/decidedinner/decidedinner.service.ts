import { Injectable } from '@nestjs/common';
import { DecideDinnerRepository } from './decidedinner.repository';
import { DecideDinner } from './models/decidedinner.entity';
import { AbstractOrmService } from '@app/common';

@Injectable()
export class DecideDinnerService extends AbstractOrmService<DecideDinner> {
  protected readonly repository: DecideDinnerRepository;

  constructor(decidedinnerRepository: DecideDinnerRepository) {
    super();
    this.repository = decidedinnerRepository;
  }
}