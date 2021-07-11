import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get('orders')
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ): Promise<PaginatedResult> {
    return this.orderService.paginate(+page, +take, ['order_items']);
  }
  //yarn add json2csv @types/json2csv package installed to export csv
  @Post('export')
  async export(@Res() res: Response) {
    const parser = new Parser({
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });
    const orders = await this.orderService.all(['order_items']);

    const json = [];
    orders.forEach((o: Order) => {
      json.push({
        ID: o.id,
        Name: o.name,
        Email: o.email,
        'Product Title': '',
        Price: '',
        Quantity: '',
      });

      o.order_items.forEach((i: OrderItem) => {
        json.push({
          ID: '',
          Name: '',
          Email: '',
          'Product Title': i.product_title,
          Price: i.price,
          Quantity: i.quantity,
        });
      });
    });
    console.log(`json before parse = ${json}`);

    const csv = parser.parse(json);

    console.log(`json after parse = ${csv}`);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  }
}
