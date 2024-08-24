import { Module } from '@nestjs/common';
import { ClientProductsService } from './client_products.service';
import { ClientProductsController } from './client_products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientProduct } from './entities/client_product.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([ClientProduct, Client, Product]),
    JwtModule,
  ],
  controllers: [ClientProductsController],
  providers: [ClientProductsService],
})
export class ClientProductsModule {}
