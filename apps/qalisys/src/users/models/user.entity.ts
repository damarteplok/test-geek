import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractOrmEntity<User> {
  @Column()
  email: string;

  @Column()
  password: string;
}
