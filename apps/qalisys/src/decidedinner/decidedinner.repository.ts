import { Injectable, Logger } from '@nestjs/common';
import { DecideDinner } from './models/decidedinner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class DecideDinnerRepository extends AbstractOrmRepository<DecideDinner> {
  protected readonly logger = new Logger(DecideDinnerRepository.name);

  constructor(
    @InjectRepository(DecideDinner) decidedinnerRepository: Repository<DecideDinner>,
    entityManager: EntityManager,
  ) {
    super(decidedinnerRepository, entityManager);
  }
}