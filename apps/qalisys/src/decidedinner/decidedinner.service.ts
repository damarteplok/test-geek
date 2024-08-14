import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DecideDinnerRepository } from './decidedinner.repository';
import { DecideDinner } from './models/decidedinner.entity';
import { Camunda8Service, AbstractOrmService, SubmittableModel } from '@app/common';

@Injectable()
export class DecideDinnerService extends AbstractOrmService<DecideDinner> implements SubmittableModel {
  protected readonly repository: DecideDinnerRepository;

  constructor(
    decidedinnerRepository: DecideDinnerRepository,
    private readonly camunda8Service: Camunda8Service,
  ) {
    super();
    this.repository = decidedinnerRepository;
  }
  
  async submitTask(): Promise<void> {
    // Implementasi logika untuk memulai submit
  }

  
}