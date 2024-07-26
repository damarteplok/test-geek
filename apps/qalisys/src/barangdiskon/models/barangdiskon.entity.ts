import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class BarangDiskon extends AbstractOrmEntity<BarangDiskon> {
  @Column()
  harga_barang: number;

  @Column()
  diskon: number;

  @Column({ nullable: true })
  diskon_rp: number;

  @Column({ nullable: true })
  total_harga: number;
}