import { AbstractBpmnOrmEntity } from '@app/common';
import { Unique, Column, Entity } from 'typeorm';


@Entity({
  name: 'decidefordinner',
})
@Unique(['bpmnProcessId'])
export class DecideForDinner extends AbstractBpmnOrmEntity<DecideForDinner> {
  
  
  @Column('varchar', { length: 256, default: "2251799815545549" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, default: "decide_for_dinner" })
  bpmnProcessId: string;

  @Column({ type: 'integer', nullable: true, default: 7 })
  version: number;

  @Column('varchar', { length: 256, nullable: true, default: "bpmn-Definitions_1dbskmr-decide-dinner.bpmn" })
  path_minio: string;

  @Column('varchar', { length: 256, nullable: true, default: "service-notif,service-paymeny" })
  servicesTask: string;
  
}