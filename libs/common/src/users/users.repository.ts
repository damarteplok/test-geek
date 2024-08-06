import { Injectable, Logger } from '@nestjs/common';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractOrmRepository } from '../databaseOrm';

@Injectable()
export class UsersRepository extends AbstractOrmRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User) usersRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }
}
