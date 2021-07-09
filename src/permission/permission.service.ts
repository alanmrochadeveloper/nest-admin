import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async findOne(id: string): Promise<Permission> {
    try {
      return this.permissionRepository.findOne({ id });
    } catch (error) {
      throw new NotFoundException(`Permission with id ${id} not found!`);
    }
  }
  async create(data: any): Promise<any> {
    return this.permissionRepository.save(data);
  }
  async all(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async delete(id: string): Promise<Permission> {
    const permissionToDelete = this.findOne(id);

    this.permissionRepository.delete(id);
    return permissionToDelete;
  }
}
