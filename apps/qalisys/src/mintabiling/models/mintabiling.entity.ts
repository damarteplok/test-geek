import { AbstractBpmnOrmEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { PesenKeRestorant } from '../../pesenkerestorant/models/pesenkerestorant.entity';

@Entity({
  name: 'mintabiling',
})

export class MintaBiling extends AbstractBpmnOrmEntity<MintaBiling> {
  
  @Column('varchar', { length: 256, nullable: true, default: "2251799813744003" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, nullable: true, default: "form_minta_billing" })
  formId: string;

  @Column({ type: 'text', nullable: true, default: 'null' })
  processVariables: string;
  
  @OneToOne(() => PesenKeRestorant, {onDelete: 'CASCADE'})
  @JoinColumn()
  pesenkerestorant: PesenKeRestorant; 
    
  
  
}