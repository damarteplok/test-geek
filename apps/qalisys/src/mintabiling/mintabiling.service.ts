import { Injectable } from '@nestjs/common';
import { MintaBilingRepository } from './mintabiling.repository';
import { MintaBiling } from './models/mintabiling.entity';
import { AbstractOrmService } from '@app/common';

@Injectable()
export class MintaBilingService extends AbstractOrmService<MintaBiling> {
  protected readonly repository: MintaBilingRepository;

  constructor(mintabilingRepository: MintaBilingRepository) {
    super();
    this.repository = mintabilingRepository;
  }
}