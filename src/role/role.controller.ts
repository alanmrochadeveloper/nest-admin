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
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
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
  async create(
    @Body('name') name: string,
    @Body('ids') ids: string[],
  ): Promise<Role> {
    return this.roleService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Get('roles')
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ): Promise<PaginatedResult> {
    return await this.roleService.paginate(+page, +take, ["permissions"]);
  }

  @Get('role/:id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne({ id }, ['permissions']);
  }

  @Put('role/:id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('ids') ids: string[], // Permissions is which must be updated
  ): Promise<Role> {
    this.roleService.update(id, {
      //first we update the name, can't do all at once
      name,
    });
    const _role = await this.roleService.findOne({ id }); // then we catch the role which we want to update its permissions
    await this.roleService.create({
      //here he create a new row in the join table
      ..._role,
      permissions: ids.map((id) => ({ id })),
    });
    return _role;
  }

  @Delete('role/:id')
  async delete(@Param('id') id: string): Promise<Role> {
    return this.roleService.delete(id);
  }
}
