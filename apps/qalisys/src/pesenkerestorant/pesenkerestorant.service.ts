import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PesenKeRestorantRepository } from './pesenkerestorant.repository';
import { PesenKeRestorant } from './models/pesenkerestorant.entity';
import { Camunda8Service, AbstractOrmService, ProcessModel } from '@app/common';

@Injectable()
export class PesenKeRestorantService extends AbstractOrmService<PesenKeRestorant> implements ProcessModel {
  protected readonly repository: PesenKeRestorantRepository;

  constructor(
    pesenkerestorantRepository: PesenKeRestorantRepository,
    private readonly camunda8Service: Camunda8Service,
  ) {
    super();
    this.repository = pesenkerestorantRepository;
  }
  async startProcess(entity: PesenKeRestorant): Promise<any> {
    // Implementasi logika untuk memulai proses
    try {
      const res = await this.camunda8Service.createProcessInstance({
        bpmnProcessId: entity.bpmnProcessId
      })
      return res
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  async startService(): Promise<void> {
    // Implementasi logika untuk memulai layanan
  }
    
  protected async beforeCreate(entity: PesenKeRestorant, extraData?: any): Promise<void> {
    const res = await this.startProcess(entity)
    entity.processDefinitionKey = res.processDefinitionKey;
    entity.bpmnProcessId = res.bpmnProcessId;
    entity.version = res.version;
    entity.processInstanceKey = res.processInstanceKey;
  }
  
  
  
}