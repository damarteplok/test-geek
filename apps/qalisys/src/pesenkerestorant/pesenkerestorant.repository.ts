import { Injectable, Logger } from '@nestjs/common';
import { PesenKeRestorant } from './models/pesenkerestorant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class PesenKeRestorantRepository extends AbstractOrmRepository<PesenKeRestorant> {
  protected readonly logger = new Logger(PesenKeRestorantRepository.name);

  constructor(
    @InjectRepository(PesenKeRestorant) pesenkerestorantRepository: Repository<PesenKeRestorant>,
    entityManager: EntityManager,
  ) {
    super(pesenkerestorantRepository, entityManager);
  }
}