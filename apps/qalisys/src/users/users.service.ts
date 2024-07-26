import { CreateUserDto } from './dtos/create-user.dto';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dtos/get-user.dto';
import { FindDto } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = new User({
      ...createUserDto,
      password,
    });
    return this.usersRepository.create(user);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({
        email: createUserDto.email,
        deleted_at: null,
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Users already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      email,
      deleted_at: null,
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are invalid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne({
      id: getUserDto.id,
      deleted_at: null,
    });
  }

  async find(attrs: Partial<User>) {
    return this.usersRepository.find({ ...attrs });
  }

  async findOne(attr: FindDto) {
    return this.usersRepository.findOne({ ...attr });
  }

  async update(attr: FindDto, attrs: Partial<User>) {
    return this.usersRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.usersRepository.findOneAndDelete({ ...attr });
  }
}
