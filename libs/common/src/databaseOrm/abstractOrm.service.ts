import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { AbstractOrmEntity } from './abstractOrm.entity';
import { AbstractOrmRepository } from './abstractOrm.repository';
import { PaginationEntity } from './paginationOrm.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class AbstractOrmService<T extends AbstractOrmEntity<T>> {
  protected abstract readonly repository: AbstractOrmRepository<T>;

  async create(entity: T): Promise<T> {
    return this.repository.create(entity);
  }

  async find(attrs: Partial<T>): Promise<T[]> {
    return this.repository.find(attrs as FindOptionsWhere<T>);
  }

  async findWithRelations(
    attrs: Partial<T>,
    relations?: string[],
  ): Promise<T[]> {
    return this.repository.findWithRelations(
      attrs as FindOptionsWhere<T>,
      relations,
    );
  }

  async findOne(attr: Partial<T>, relations?: string[]): Promise<T> {
    return this.repository.findOne(attr as FindOptionsWhere<T>, relations);
  }

  async findByWithPagination(
    page: number,
    limit: number,
    attrs: Partial<T>,
    relations?: string[],
    order?: FindOptionsOrder<T>,
  ): Promise<PaginationEntity<T>> {
    return this.repository.findByWithPagination(
      page,
      limit,
      attrs as FindOptionsWhere<T>,
      relations,
      order,
    );
  }

  async findByKeywordsWithPagination(
    page: number,
    limit: number,
    nameTable: string,
    keywords?: string,
    searchColumns?: (keyof T)[],
    attrs?: Partial<T>,
    relations?: string[],
    order?: FindOptionsOrder<T>,
  ): Promise<PaginationEntity<T>> {
    return this.repository.findByKeywordsWithPagination(
      page,
      limit,
      nameTable,
      keywords,
      searchColumns,
      attrs as FindOptionsWhere<T>,
      relations,
      order,
    );
  }

  async update(
    attr: Partial<T>,
    attrs: Partial<T>,
    relations?: string[],
  ): Promise<T> {
    return this.repository.findOneAndUpdate(
      attr as FindOptionsWhere<T>,
      attrs as QueryDeepPartialEntity<T>,
      relations,
    );
  }

  async remove(attr: Partial<T>): Promise<void> {
    await this.repository.findOneAndDelete(attr as FindOptionsWhere<T>);
  }
}
