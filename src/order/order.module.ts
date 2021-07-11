import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItem } from './entity/order-item.entity';
import { Order } from './entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CommonModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
