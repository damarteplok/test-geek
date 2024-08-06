import { Exclude } from 'class-transformer';
import { AbstractOrmEntity } from '../../databaseOrm';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { UserStatusEnum } from '../../config';
import { RoleEntity } from '../../role/models/role.entity';

@Entity()
export class User extends AbstractOrmEntity<User> {
  @Index()
  @Column()
  email: string;

  @Column()
  password: string;

  @Index()
  @Column('varchar', { length: 256, nullable: true })
  name: string;

  @Column('varchar', { length: 256, nullable: true })
  address: string;

  @Column('varchar', { length: 256, nullable: true })
  contact: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(() => RoleEntity, (role) => role.user, { cascade: true })
  @JoinTable({
    name: 'role_user',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  role: RoleEntity[];

  @Column({
    nullable: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  twoFASecret?: string;

  @Exclude({
    toPlainOnly: true,
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  twoFAThrottleTime?: Date;

  @Column({
    default: false,
  })
  isTwoFAEnabled: boolean;

  roles?: number[];
}
