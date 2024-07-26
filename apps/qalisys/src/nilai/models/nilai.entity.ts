import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Nilai extends AbstractOrmEntity<Nilai> {
  @Column()
  nilai_1: number;

  @Column()
  nilai_2: number;

  @Column()
  nilai_3: number;

  @Column()
  rata_rata: number;

  @Column()
  lulus: string;
}