import { Injectable } from '@nestjs/common';
import { ChooseDinnerRepository } from './choosedinner.repository';
import { FindDto } from '@app/common';
import { CreateChooseDinnerDto } from './dtos/create-choosedinner.dto';
import { ChooseDinner } from './models/choosedinner.entity';

@Injectable()
export class ChooseDinnerService {
  constructor(private readonly choosedinnerRepository: ChooseDinnerRepository) {}

  async create(createChooseDinnerDto: CreateChooseDinnerDto) {
    const choosedinner = new ChooseDinner({
      ...createChooseDinnerDto,
    });
    return this.choosedinnerRepository.create(choosedinner);
  }

  async find(attrs: Partial<ChooseDinner>) {
    return this.choosedinnerRepository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.choosedinnerRepository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<ChooseDinner>) {
    return this.choosedinnerRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.choosedinnerRepository.findOneAndDelete({ ...attr });
  }
}