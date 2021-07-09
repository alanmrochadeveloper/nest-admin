import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleCreateDTO } from './dto/role-create.dto';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async all(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
  async paginate(page: number = 1, take: number = 1): Promise<any> {
    const [roles, total] = await this.roleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['permissions'],
    });
    return {
      data: roles.map(({ ...roles }) => {
        return roles;
      }),
      metadata: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async create(data: any): Promise<Role> {
    return this.roleRepository.save(data);
  }

  async findOne(condition): Promise<Role> {
    return this.roleRepository.findOne(condition, {
      relations: ['permissions'],
    });
  }
  async update(id, data: any): Promise<Role> {
    this.roleRepository.update(id, data);
    return await this.findOne({ id });
  }

  async delete(id: string): Promise<Role> {
    const userToDelete = this.findOne({ id });
    await this.roleRepository.delete(id);
    return userToDelete;
  }
}
