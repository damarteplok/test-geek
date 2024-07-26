import { Injectable } from '@nestjs/common';
import { BarangDiskonRepository } from './barangdiskon.repository';
import { FindDto } from '@app/common';
import { CreateBarangDiskonDto } from './dtos/create-barangdiskon.dto';
import { BarangDiskon } from './models/barangdiskon.entity';

@Injectable()
export class BarangDiskonService {
  constructor(private readonly barangdiskonRepository: BarangDiskonRepository) {}

  async create(createBarangDiskonDto: CreateBarangDiskonDto) {
    const barangdiskon = new BarangDiskon({
      ...createBarangDiskonDto,
    });
    return this.barangdiskonRepository.create(barangdiskon);
  }

  async find(attrs: Partial<BarangDiskon>) {
    return this.barangdiskonRepository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.barangdiskonRepository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<BarangDiskon>) {
    return this.barangdiskonRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.barangdiskonRepository.findOneAndDelete({ ...attr });
  }
}