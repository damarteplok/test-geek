import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '../databaseOrm';
import { RoleEntity } from './models/role.entity';

@Injectable()
export class RoleRepository extends AbstractOrmRepository<RoleEntity> {
  protected readonly logger = new Logger(RoleRepository.name);

  constructor(
    @InjectRepository(RoleEntity)
    roleRepository: Repository<RoleEntity>,
    entityManager: EntityManager,
  ) {
    super(roleRepository, entityManager);
  }
}
