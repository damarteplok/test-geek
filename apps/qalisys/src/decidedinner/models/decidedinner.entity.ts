import { AbstractBpmnOrmEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { DecideForDinner } from '../../decidefordinner/models/decidefordinner.entity';

@Entity({
  name: 'decidedinner',
})

export class DecideDinner extends AbstractBpmnOrmEntity<DecideDinner> {
  
  @Column('varchar', { length: 256, nullable: true, default: "2251799815545549" })
  processDefinitionKey: string;

  @Column({ type: 'text', nullable: true, default: '"{\"meal\": [\"Chicken\", \"Salad\"]}"' })
  processVariables: string;
  
  @OneToOne(() => DecideForDinner, {onDelete: 'CASCADE'})
  @JoinColumn()
  decidefordinner: DecideForDinner; 
    
  
  
}