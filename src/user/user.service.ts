import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/user-create.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async all(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async paginate(page: number = 1, take: number = 1) {
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });
    return {
      data: users.map(({ password, ...user }) => {
        return user;
      }),
      metadata: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async create(data: any): Promise<any> {
    console.log('register data = ', data);
    return this.userRepository.save(data);
  }

  async findOne(condition): Promise<User> {
    return this.userRepository.findOne(condition);
  }
  async update(id, data: any): Promise<User> {
    this.userRepository.update(id, data);
    return await this.findOne({ id });
  }

  async delete(id: string): Promise<User> {
    const userToDelete = this.findOne({ id });
    await this.userRepository.delete(id);
    return userToDelete;
  }
}
