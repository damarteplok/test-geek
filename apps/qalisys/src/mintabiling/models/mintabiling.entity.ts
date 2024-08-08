import { AbstractBpmnOrmEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { DecideForDinner } from '../../decidefordinner/models/decidefordinner.entity';

@Entity({
  name: 'mintabiling',
})

export class MintaBiling extends AbstractBpmnOrmEntity<MintaBiling> {
  
  @Column('varchar', { length: 256, nullable: true, default: "2251799815545549" })
  processDefinitionKey: string;

  @Column({ type: 'text', nullable: true, default: 'null' })
  processVariables: string;
  
  @OneToOne(() => DecideForDinner, {onDelete: 'CASCADE'})
  @JoinColumn()
  decidefordinner: DecideForDinner; 
    
  
  
}