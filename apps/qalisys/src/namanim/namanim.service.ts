import { Injectable } from '@nestjs/common';
import { NamaNimRepository } from './namanim.repository';
import { FindDto } from '@app/common';
import { CreateNamaNimDto } from './dtos/create-namanim.dto';
import { NamaNim } from './models/namanim.entity';

@Injectable()
export class NamaNimService {
  constructor(private readonly namanimRepository: NamaNimRepository) {}

  async create(createNamaNimDto: CreateNamaNimDto) {
    const namanim = new NamaNim({
      ...createNamaNimDto,
    });
    return this.namanimRepository.create(namanim);
  }

  async find(attrs: Partial<NamaNim>) {
    return this.namanimRepository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.namanimRepository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<NamaNim>) {
    return this.namanimRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.namanimRepository.findOneAndDelete({ ...attr });
  }
}