import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDTO } from './dto/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HasPermission('users')
  async create(@Body() body: CreateUserDTO): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    const { role_id, ...data } = body;
    return this.userService.create({
      ...data,
      password,
      role: { id: role_id },
    });
  }

  @Get()
  @HasPermission('users')
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ) {
    return await this.userService.paginate(+page, +take, ['role']);
  }

  @Get(':id')
  @HasPermission('users')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ id }, ['role']);
  }
  @Put('info')
  @HasPermission('users')
  async updateInfo(
    @Req() request: Request,
    @Body() body: UserUpdateDTO,
  ): Promise<User> {
    const id = await this.authService.userId(request);
    this.userService.update(id, body); // the author sent role, but as he stated it's not needed!
    return this.userService.findOne({ id });
  }

  @Put('password')
  @HasPermission('users')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password,
    @Body('confirm_password') confirm_password,
  ): Promise<User> {
    if (password !== confirm_password) {
      throw new BadRequestException(`passwords do not match`);
    }

    const id = await this.authService.userId(request);

    const hashed = await bcrypt.hash(password, 12);

    return this.userService.update(id, { password: hashed });
  }

  @Put(':id')
  @HasPermission('users')
  async update(
    @Param('id') id: string,
    @Body() body: UserUpdateDTO, //
  ): Promise<User> {
    const { role_id, ...data } = body;

    return this.userService.update(id, { ...data, role: { id: role_id } });
  }

  @Delete(':id')
  @HasPermission('users')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
