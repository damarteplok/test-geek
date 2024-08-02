import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { PermissionEntity } from './models/permission.entity';
import { AbstractOrmService } from '../databaseOrm';

@Injectable()
export class PermissionService extends AbstractOrmService<PermissionEntity> {
  protected readonly repository: PermissionRepository;

  constructor(permissionRepository: PermissionRepository) {
    super();
    this.repository = permissionRepository;
  }
}
