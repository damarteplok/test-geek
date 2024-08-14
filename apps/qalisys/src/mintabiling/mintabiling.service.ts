import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MintaBilingRepository } from './mintabiling.repository';
import { MintaBiling } from './models/mintabiling.entity';
import { Camunda8Service, AbstractOrmService, SubmittableModel } from '@app/common';

@Injectable()
export class MintaBilingService extends AbstractOrmService<MintaBiling> implements SubmittableModel {
  protected readonly repository: MintaBilingRepository;

  constructor(
    mintabilingRepository: MintaBilingRepository,
    private readonly camunda8Service: Camunda8Service,
  ) {
    super();
    this.repository = mintabilingRepository;
  }
  
  async submitTask(): Promise<void> {
    // Implementasi logika untuk memulai submit
  }

  
}