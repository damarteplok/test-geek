import { Injectable } from '@nestjs/common';
import { NilaiRepository } from './nilai.repository';
import { FindDto } from '@app/common';
import { CreateNilaiDto } from './dtos/create-nilai.dto';
import { Nilai } from './models/nilai.entity';

@Injectable()
export class NilaiService {
  constructor(private readonly nilaiRepository: NilaiRepository) {}

  async create(createNilaiDto: CreateNilaiDto) {
    const nilai = new Nilai({
      ...createNilaiDto,
    });
    return this.nilaiRepository.create(nilai);
  }

  async find(attrs: Partial<Nilai>) {
    return this.nilaiRepository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.nilaiRepository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<Nilai>) {
    return this.nilaiRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.nilaiRepository.findOneAndDelete({ ...attr });
  }
}