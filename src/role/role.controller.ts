import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDTO } from 'src/user/dto/user-update.dto';
import { RoleCreateDTO } from './dto/role-create.dto';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';

@Controller()
@UseGuards(AuthGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('role')
  async create(@Body() body: RoleCreateDTO): Promise<Role> {
    return this.roleService.create(body);
  }

  @Get('roles')
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ): Promise<Role[]> {
    return await this.roleService.paginate(+page, +take);
  }

  @Get('role/:id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne({ id });
  }

  @Put('role/:id')
  async update(
    @Param('id') id: string,
    @Body() body: RoleUpdateDTO,
  ): Promise<Role> {
    return this.roleService.update(id, body);
  }

  @Delete('role/:id')
  async delete(@Param('id') id: string): Promise<Role> {
    return this.roleService.delete(id);
  }
}
