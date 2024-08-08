import { Column } from 'typeorm';
import { AbstractOrmEntity } from './abstractOrm.entity';

export class AbstractBpmnOrmEntity<T> extends AbstractOrmEntity<T> {
  @Column({ type: 'varchar', nullable: true })
  bpmnProcessId: string;

  @Column({ type: 'varchar', nullable: true })
  processInstanceKey: string;

  @Column({ type: 'varchar', nullable: true })
  processDefinitionKey: string;

  @Column({ type: 'varchar', nullable: true })
  formId: string;

  @Column({ type: 'varchar', nullable: true })
  taskDefinitionId: string;

  @Column({ type: 'varchar', nullable: true })
  taskId: string;

  @Column({ type: 'integer', nullable: true, default: 1 })
  version: number;

  @Column({ type: 'varchar', nullable: true })
  path_minio: string;
}
