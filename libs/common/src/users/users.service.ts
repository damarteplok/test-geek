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
import { In } from 'typeorm';
import { AbstractOrmService } from '../databaseOrm';
import { RoleRepository } from '../role';
import { FindDto } from '../dto';
import { RoleEntity } from '../role/models/role.entity';

@Injectable()
export class UsersService extends AbstractOrmService<User> {
  protected readonly repository: UsersRepository;

  constructor(
    usersRepository: UsersRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
    this.repository = usersRepository;
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const password = await bcrypt.hash(createUserDto.password, 10);
    const roles = await this.checkRoleId(createUserDto.roles);
    const user = new User({
      ...createUserDto,
      password,
      role: roles,
    });
    return this.repository.create(user);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.repository.findOne({
        email: createUserDto.email,
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Users already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.repository.findOne(
      {
        email,
      },
      ['role', 'role.permission'],
    );
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are invalid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.repository.findOne(
      {
        id: getUserDto.id,
      },
      ['role', 'role.permission'],
    );
  }

  async update(attr: FindDto, attrs: Partial<User>, relations?: string[]) {
    const user = await this.repository.findOne({ ...attr });
    if (!user) {
      throw new NotFoundException(`User with ID ${attr.id} not found`);
    }
    // check email
    if (attrs.email && attrs.email !== user.email) {
      const existingUser = await this.repository.findOne({
        email: attrs.email,
      });
      if (existingUser) {
        throw new BadRequestException(
          'Email is already in use by another user.',
        );
      }
    }
    // check if have roles
    if (attrs.roles) {
      const roles = await this.checkRoleId(attrs.roles);
      attrs.role = roles;
      const role = await this.repository.findOne({
        id: attr.id,
      });

      if (!role) {
        throw new NotFoundException(`User with ID ${attr.id} not found`);
      }
      Object.assign(role, attrs);

      return this.repository.save(role);
    }

    return this.repository.findOneAndUpdate({ ...attr }, attrs, relations);
  }

  private async checkRoleId(arr: number[] = []): Promise<RoleEntity[]> {
    const roles = await this.roleRepository.find({
      id: In(arr),
    });

    if (roles.length !== arr.length) {
      const invalidRoleIds = arr.filter(
        (id) => !roles.some((el) => el.id === id),
      );
      throw new NotFoundException(
        `Roles with IDs [${invalidRoleIds.join(', ')}] not found`,
      );
    }
    return roles;
  }
}
