import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/user-create.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async paginate(
    page: number = 1,
    take: number = 1,
    relations = [],
  ): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, take, relations);
    return {
      data: data.map((user) => {
        const { password, ...data } = user;
        return data;
      }),
      meta: meta,
    };
  }
}
