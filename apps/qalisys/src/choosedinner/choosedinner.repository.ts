import { Injectable, Logger } from '@nestjs/common';
import { ChooseDinner } from './models/choosedinner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class ChooseDinnerRepository extends AbstractOrmRepository<ChooseDinner> {
  protected readonly logger = new Logger(ChooseDinnerRepository.name);

  constructor(
    @InjectRepository(ChooseDinner) choosedinnerRepository: Repository<ChooseDinner>,
    entityManager: EntityManager,
  ) {
    super(choosedinnerRepository, entityManager);
  }
}