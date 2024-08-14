import { AbstractBpmnOrmEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { PesenKeRestorant } from '../../pesenkerestorant/models/pesenkerestorant.entity';

@Entity({
  name: 'decidedinner',
})

export class DecideDinner extends AbstractBpmnOrmEntity<DecideDinner> {
  
  @Column('varchar', { length: 256, nullable: true, default: "2251799813744003" })
  processDefinitionKey: string;

  @Column('varchar', { length: 256, nullable: true, default: "form_decide_what_for_dinner" })
  formId: string;

  @Column({ type: 'text', nullable: true, default: '"{\"meal\": [\"Chicken\", \"Salad\"]}"' })
  processVariables: string;
  
  @OneToOne(() => PesenKeRestorant, {onDelete: 'CASCADE'})
  @JoinColumn()
  pesenkerestorant: PesenKeRestorant; 
    
  
  
}