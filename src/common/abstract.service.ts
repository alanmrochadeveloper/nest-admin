import { Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}
  async all(relations = []): Promise<any[]> {
    return await this.repository.find({ relations });
  }
  async paginate(
    page: number = 1,
    take: number = 1,
    relations = [],
  ): Promise<PaginatedResult> {
    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });
    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async create(data: any): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(condition, relations = []): Promise<any> {
    return this.repository.findOne(condition, { relations });
  }
  async update(id, data: any): Promise<any> {
    this.repository.update(id, data);
    return await this.findOne({ id });
  }

  async delete(id: string): Promise<any> {
    const dataToDelete = this.findOne({ id });
    await this.repository.delete(id);
    return dataToDelete;
  }
}
