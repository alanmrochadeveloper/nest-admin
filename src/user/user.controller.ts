import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDTO } from './dto/user-update.dto';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async create(@Body() body: CreateUserDTO): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password,
    });
  }

  @Get('users')
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ): Promise<User[]> {
    return await this.userService.paginate(+page, +take);
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ id });
  }

  @Put('user/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UserUpdateDTO,
  ): Promise<User> {
    return this.userService.update(id, body);
  }

  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
