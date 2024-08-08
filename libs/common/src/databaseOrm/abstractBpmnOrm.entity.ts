import { Column } from 'typeorm';
import { AbstractOrmEntity } from './abstractOrm.entity';

export class AbstractBpmnOrmEntity<T> extends AbstractOrmEntity<T> {
  @Column('varchar', { length: 256, nullable: true })
  processInstanceKey: string;

  @Column('varchar', { length: 256, nullable: true })
  formId: string;

  @Column('varchar', { length: 256, nullable: true })
  taskDefinitionId: string;

  @Column('varchar', { length: 256, nullable: true })
  taskId: string;
}
