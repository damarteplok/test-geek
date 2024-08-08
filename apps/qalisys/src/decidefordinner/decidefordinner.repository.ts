import { Injectable, Logger } from '@nestjs/common';
import { DecideForDinner } from './models/decidefordinner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class DecideForDinnerRepository extends AbstractOrmRepository<DecideForDinner> {
  protected readonly logger = new Logger(DecideForDinnerRepository.name);

  constructor(
    @InjectRepository(DecideForDinner) decidefordinnerRepository: Repository<DecideForDinner>,
    entityManager: EntityManager,
  ) {
    super(decidefordinnerRepository, entityManager);
  }
}