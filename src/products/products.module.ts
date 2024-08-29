import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderItem } from '../orders/entities/order-item.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product, OrderItem]), JwtModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
