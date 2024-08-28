import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Table({ modelName: 'OrderItems' })
export class OrderItem extends Model<OrderItem> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the order item',
  })
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the order',
  })
  @IsNumber()
  @IsNotEmpty()
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the product',
  })
  @IsNumber()
  @IsNotEmpty()
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @ApiProperty({
    example: 5,
    description: 'Amount of the product ordered',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @ApiProperty({
    example: 50,
    description: 'Total price for the order item',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  total: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Order)
  order: Order;
}
