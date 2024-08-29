import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ClientProduct } from '../../client_products/entities/client_product.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

@Table({ modelName: 'Clients' })
export class Client extends Model<Client> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the client',
  })
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the client',
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the client',
  })
  @IsPhoneNumber(null)
  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Email address of the client',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Optional: Ensure email is unique
  })
  email: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Address of the client',
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @ApiProperty({
    example: 'some-refresh-token',
    description: 'Refresh token for the client (optional)',
  })
  @IsOptional()
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true, // Make it optional
  })
  refresh_token?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the client is active or not',
  })
  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default value is false
  })
  is_active: boolean;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the client',
  })
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @ApiProperty({
    example: '98tu349t9tgjsoghe9tgog',
    description: 'uuid for activate user',
  })
  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @HasMany(() => ClientProduct)
  clientProducts: ClientProduct[];

  @ApiProperty({
    type: () => [Product],
    description: 'Products associated with the client',
  })
  @HasMany(() => Product, 'productId')
  products: Product[];

  @HasMany(() => Order)
  orders: Order[];
}
