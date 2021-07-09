import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionCreateDTO } from './dto/permission-create.dto';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}
  @Post()
  async create(@Body() body: PermissionCreateDTO): Promise<any> {
    const { ...data } = body;
    return await this.permissionService.create(data);
  }

  @Get()
  async all(): Promise<Permission[]> {
    return await this.permissionService.all();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Permission>{
      return this.permissionService.delete(id);
  }
}
