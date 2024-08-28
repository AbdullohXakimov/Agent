import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { ClientsModule } from './clients/clients.module';
import { Client } from './clients/entities/client.entity';
import { ClientProductsModule } from './client_products/client_products.module';
import { ClientProduct } from './client_products/entities/client_product.entity';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.P_PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      models: [
        Product, Client, ClientProduct, Admin
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    ProductsModule,
    ClientsModule,
    ClientProductsModule,
    AdminsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
