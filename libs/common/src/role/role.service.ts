import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractOrmService } from '../databaseOrm';
import { RoleEntity } from './models/role.entity';
import { RoleRepository } from './role.repository';
import { In } from 'typeorm';
import { PermissionRepository } from '../permission';
import { PermissionEntity } from '../permission/models/permission.entity';

@Injectable()
export class RoleService extends AbstractOrmService<RoleEntity> {
  protected readonly repository: RoleRepository;

  constructor(
    roleRepository: RoleRepository,
    private readonly permissionsRepository: PermissionRepository,
  ) {
    super();
    this.repository = roleRepository;
  }

  async create(roleEntity: RoleEntity) {
    const permissions = await this.checkPermissionIds(roleEntity.permissions);
    roleEntity.permission = permissions;
    return this.repository.create(roleEntity);
  }

  async update(
    attr: Partial<RoleEntity>,
    attrs: Partial<RoleEntity>,
    relations?: string[],
  ): Promise<RoleEntity> {
    if (attrs.permissions) {
      const permissions = await this.checkPermissionIds(attrs.permissions);
      attrs.permission = permissions;
      const role = await this.repository.findOne({
        id: attr.id,
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${attr.id} not found`);
      }
      Object.assign(role, attrs);

      return this.repository.save(role);
    }
    return this.repository.findOneAndUpdate({ id: attr.id }, attrs, relations);
  }

  private async checkPermissionIds(
    arr: number[] = [],
  ): Promise<PermissionEntity[]> {
    const permissions = await this.permissionsRepository.find({
      id: In(arr),
    });

    if (permissions.length !== arr.length) {
      const invalidRoleIds = arr.filter(
        (id) => !permissions.some((permission) => permission.id === id),
      );
      throw new NotFoundException(
        `Permissions with IDs [${invalidRoleIds.join(', ')}] not found`,
      );
    }
    return permissions;
  }
}
