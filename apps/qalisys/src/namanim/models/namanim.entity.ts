import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class NamaNim extends AbstractOrmEntity<NamaNim> {
  @Column()
  nim: string;

  @Column()
  nama: string;

  @Column({ nullable: true })
  karakter_empat: string;
}