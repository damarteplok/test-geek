import { Injectable, Logger } from '@nestjs/common';
import { Nilai } from './models/nilai.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '@app/common';

@Injectable()
export class NilaiRepository extends AbstractOrmRepository<Nilai> {
  protected readonly logger = new Logger(NilaiRepository.name);

  constructor(
    @InjectRepository(Nilai) nilaiRepository: Repository<Nilai>,
    entityManager: EntityManager,
  ) {
    super(nilaiRepository, entityManager);
  }
}