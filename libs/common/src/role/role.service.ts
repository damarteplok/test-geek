import { Injectable } from '@nestjs/common';
import { AbstractOrmService } from '../databaseOrm';
import { RoleEntity } from './models/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService extends AbstractOrmService<RoleEntity> {
  protected readonly repository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    super();
    this.repository = roleRepository;
  }
}
