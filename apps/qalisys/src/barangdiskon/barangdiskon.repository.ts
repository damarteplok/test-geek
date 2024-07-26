import { Injectable, Logger } from '@nestjs/common';
import { BarangDiskon } from './models/barangdiskon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class BarangDiskonRepository extends AbstractOrmRepository<BarangDiskon> {
  protected readonly logger = new Logger(BarangDiskonRepository.name);

  constructor(
    @InjectRepository(BarangDiskon) barangdiskonRepository: Repository<BarangDiskon>,
    entityManager: EntityManager,
  ) {
    super(barangdiskonRepository, entityManager);
  }
}