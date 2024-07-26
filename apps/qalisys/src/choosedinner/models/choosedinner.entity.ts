import { AbstractOrmEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class ChooseDinner extends AbstractOrmEntity<ChooseDinner> {
  @Column()
  process_instance_id: string;

  @Column()
  business_key: string;
}