import { AbstractBpmnOrmEntity } from '@app/common';
import { Unique, Column, Entity } from 'typeorm';


@Entity({
  name: 'pesenkerestorant',
})
@Unique(['processInstanceKey'])
export class PesenKeRestorant extends AbstractBpmnOrmEntity<PesenKeRestorant> {
  
  
  @Column('varchar', { length: 256, default: "2251799813744003" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, default: "pesen_ke_restorant" })
  bpmnProcessId: string = "pesen_ke_restorant";

  @Column({ type: 'integer', nullable: true, default: 3 })
  version: number;

  @Column('varchar', { length: 256, nullable: true, default: "bpmn-Definitions_1dbskmr-decide-dinner.bpmn" })
  path_minio: string;

  @Column('varchar', { length: 256, nullable: true, default: "service-notif,service-payment,service-notif-message-end" })
  servicesTask: string;

  @Column({ type: 'text', nullable: true, default: '[{"name":"shopee_masuk","correlationKey":"=shopee_masuk=true"}]' })
  messageServices: string;
  
}