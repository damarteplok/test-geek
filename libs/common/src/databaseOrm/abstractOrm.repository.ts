import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractOrmEntity } from './abstractOrm.entity';
import {
  DeleteResult,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractOrmRepository<T extends AbstractOrmEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({ where });
    if (!entity) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );
    if (!updateResult.affected) {
      this.logger.warn(`Entity was not found with where`, where);
      throw new NotFoundException('Entity was not found');
    }
    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<DeleteResult> {
    const deleteResult = await this.entityRepository.delete(where);
    if (!deleteResult.affected) {
      this.logger.warn(`Entity was not found with where`, where);
      throw new NotFoundException('Entity was not found');
    }
    return deleteResult;
  }
}
