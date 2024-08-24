import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Client } from '../../clients/entities/client.entity';
import { Product } from '../../products/entities/product.entity';

@Table({ modelName: 'ClientProducts' })
export class ClientProduct extends Model<ClientProduct> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the client-product record',
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
  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clientId: number;

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
    description: 'Amount of the product for the client',
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;
}
