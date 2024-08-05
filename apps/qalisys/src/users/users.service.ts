import { CreateUserDto } from './dtos/create-user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dtos/get-user.dto';
import { FindDto, RoleRepository } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

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
    const user = await this.usersRepository.findOne({ ...attr });
    if (!user) {
      throw new NotFoundException(`User with ID ${attr.id} not found`);
    }
    // check email
    if (attrs.email && attrs.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        email: attrs.email,
      });
      if (existingUser) {
        throw new BadRequestException(
          'Email is already in use by another user.',
        );
      }
    }
    // check roleID
    if (attrs.roleId !== undefined) {
      const role = await this.roleRepository.findOne({
        id: attrs.roleId,
        deleted_at: null,
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${attrs.roleId} not found`);
      }
    }
    return this.usersRepository.findOneAndUpdate({ ...attr }, attrs);
  }

  async remove(attr: FindDto) {
    return this.usersRepository.findOneAndDelete({ ...attr });
  }
}
