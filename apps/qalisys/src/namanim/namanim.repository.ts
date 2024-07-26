import { Injectable, Logger } from '@nestjs/common';
import { NamaNim } from './models/namanim.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class NamaNimRepository extends AbstractOrmRepository<NamaNim> {
  protected readonly logger = new Logger(NamaNimRepository.name);

  constructor(
    @InjectRepository(NamaNim) namanimRepository: Repository<NamaNim>,
    entityManager: EntityManager,
  ) {
    super(namanimRepository, entityManager);
  }
}