import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';

@Injectable()
export class OrderService extends AbstractService {
  constructor(
    @InjectRepository(Order) private orderService: Repository<Order>,
  ) {
    super(orderService);
  }

  async paginate(page: number = 1, take: number = 1, relations = []) {
    const { data, meta } = await super.paginate(page, take, relations);

    return {
      data: data.map((order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        create_at: order.created_at,
      })),
      meta,
    };
  }
}
