import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../clients/entities/client.entity';


@Table({ modelName: 'Products' })
export class Product extends Model<Product> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the product',
  })
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Product Name',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  @Column
  name: string;

  @ApiProperty({
    example: 100,
    description: 'Price of the product',
  })
  @IsNumber()
  @Column({
    type: DataType.FLOAT, // or use DataType.DECIMAL(10, 2) for precision
    allowNull: false,
  })
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Amount of the product in stock',
  })
  @IsNumber()
  @Column
  amount: number;

  @ApiProperty({
    type: () => [Client],
    description: 'Clients associated with the product',
  })
  @HasMany(() => Client, 'clientId')
  clients: Client[];
}
