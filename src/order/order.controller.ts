import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { OrderService } from './order.service';

@UseGuards(AuthGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('orders')
  async all(
    @Query('page') page: string,
    @Query('take') take: string,
  ): Promise<PaginatedResult> {
    return this.orderService.paginate(+page, +take, ['order_items']);
  }
}
