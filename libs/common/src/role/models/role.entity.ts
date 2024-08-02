import { Column, Entity, Index, JoinTable, ManyToMany, Unique } from 'typeorm';

import { AbstractOrmEntity } from '../../databaseOrm';
import { PermissionEntity } from '../../permission/models/permission.entity';

@Entity({
  name: 'role',
})
@Unique(['name'])
export class RoleEntity extends AbstractOrmEntity<RoleEntity> {
  @Column('varchar', { length: 100 })
  @Index({
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.role)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permission: PermissionEntity[];
}
