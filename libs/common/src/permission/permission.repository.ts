import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PermissionEntity } from './models/permission.entity';
import { AbstractOrmRepository } from '../databaseOrm';

@Injectable()
export class PermissionRepository extends AbstractOrmRepository<PermissionEntity> {
  protected readonly logger = new Logger(PermissionRepository.name);

  constructor(
    @InjectRepository(PermissionEntity)
    permissionRepository: Repository<PermissionEntity>,
    entityManager: EntityManager,
  ) {
    super(permissionRepository, entityManager);
  }
}
