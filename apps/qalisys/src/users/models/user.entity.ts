import { AbstractOrmEntity, UserStatusEnum } from '@app/common';
import { RoleEntity } from '@app/common/role/models/role.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class User extends AbstractOrmEntity<User> {
  @Index()
  @Column()
  email: string;

  @Column()
  password: string;

  @Index()
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @OneToOne(() => RoleEntity)
  @JoinColumn()
  role: RoleEntity;

  @Column({ nullable: true })
  roleId: number;

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
}
