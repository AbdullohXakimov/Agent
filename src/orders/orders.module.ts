import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem]), JwtModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
