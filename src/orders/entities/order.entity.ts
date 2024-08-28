import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { OrderItem } from './order-item.entity';

@Table({ modelName: 'Orders' })
export class Order extends Model<Order> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the order',
  })
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the client',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clientId: number;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the order is finished',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  finished: boolean;

  @ApiProperty({
    example: 100.5,
    description: 'Total price for the order',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  totalPrice: number;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
