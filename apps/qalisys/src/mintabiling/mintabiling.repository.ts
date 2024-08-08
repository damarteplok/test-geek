import { Injectable, Logger } from '@nestjs/common';
import { MintaBiling } from './models/mintabiling.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class MintaBilingRepository extends AbstractOrmRepository<MintaBiling> {
  protected readonly logger = new Logger(MintaBilingRepository.name);

  constructor(
    @InjectRepository(MintaBiling) mintabilingRepository: Repository<MintaBiling>,
    entityManager: EntityManager,
  ) {
    super(mintabilingRepository, entityManager);
  }
}