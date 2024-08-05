import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractOrmEntity } from './abstractOrm.entity';
import {
  DeleteResult,
  EntityManager,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationEntity } from './paginationOrm.entity';

export abstract class AbstractOrmRepository<T extends AbstractOrmEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });
    if (!entity) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    relations: string[] = [],
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );
    if (!updateResult.affected) {
      this.logger.warn(`Entity was not found with where`, where);
      throw new NotFoundException('Entity was not found');
    }
    return this.findOne(where, relations);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.entityRepository.findBy(where);
  }

  async findWithRelations(
    where: FindOptionsWhere<T>,
    relations: string[],
  ): Promise<T[]> {
    return this.entityRepository.find({
      where,
      relations,
    });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<DeleteResult> {
    const deleteResult = await this.entityRepository.delete(where);
    if (!deleteResult.affected) {
      this.logger.warn(`Entity was not found with where`, where);
      throw new NotFoundException('Entity was not found');
    }
    return deleteResult;
  }

  async findByWithPagination(
    page: number,
    limit: number,
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    order: FindOptionsOrder<T> = {},
  ): Promise<PaginationEntity<T>> {
    const [results, totalItems] = await this.entityRepository.findAndCount({
      where,
      relations,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return new PaginationEntity(
      results,
      page,
      limit,
      totalItems,
      page < totalPages ? page + 1 : null,
      page > 1 ? page - 1 : null,
    );
  }

  // for advance searching
  async findByKeywordsWithPagination(
    page: number,
    limit: number,
    nameTable: string,
    keywords: string,
    searchColumns: (keyof T)[],
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    order: FindOptionsOrder<T> = {},
    selectColumns: (keyof T)[] = [],
  ): Promise<PaginationEntity<T>> {
    const queryBuilder = this.entityRepository.createQueryBuilder(nameTable);

    if (selectColumns.length > 0) {
      queryBuilder.select([]);
      selectColumns.forEach((column) => {
        queryBuilder.addSelect(`${nameTable}.${String(column)}`);
      });
    }

    if (keywords) {
      searchColumns.forEach((column, index) => {
        const condition = `${nameTable}.${String(column)} ILIKE :keywords`;
        if (index === 0) {
          queryBuilder.where(condition, { keywords: `%${keywords}%` });
        } else {
          queryBuilder.orWhere(condition, { keywords: `%${keywords}%` });
        }
      });
    }

    Object.keys(where).forEach((key, index) => {
      if (index === 0 && !keywords) {
        queryBuilder.where(`entity.${key} = :${key}`, { [key]: where[key] });
      } else {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: where[key] });
      }
    });

    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    if (Object.keys(order).length) {
      Object.keys(order).forEach((column) => {
        queryBuilder.addOrderBy(`${nameTable}.${column}`, order[column]);
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [results, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationEntity(
      results,
      page,
      limit,
      totalItems,
      page < totalPages ? page + 1 : null,
      page > 1 ? page - 1 : null,
    );
  }

  async count(where: FindOptionsWhere<T>): Promise<number> {
    return this.entityRepository.countBy(where);
  }

  async executeQuery(
    queryBuilder: (qb: SelectQueryBuilder<T>) => void,
  ): Promise<T[]> {
    const qb = this.entityRepository.createQueryBuilder();
    queryBuilder(qb);
    return qb.getMany();
  }
}
