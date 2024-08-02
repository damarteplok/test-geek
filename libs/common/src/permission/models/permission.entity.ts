import { Column, Entity, Index, ManyToMany, Unique } from 'typeorm';
import { AbstractOrmEntity } from '../../databaseOrm';
import { RoleEntity } from '../../role/models/role.entity';

@Entity({
  name: 'permission',
})
@Unique(['description'])
export class PermissionEntity extends AbstractOrmEntity<PermissionEntity> {
  @Column('varchar', { length: 100 })
  resource: string;

  @Column()
  @Index({
    unique: true,
  })
  description: string;

  @Column()
  path: string;

  @Column('varchar', {
    default: 'get',
    length: 20,
  })
  method: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => RoleEntity, (role) => role.permission)
  role: RoleEntity[];
}
