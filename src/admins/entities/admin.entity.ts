import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface IAdminInter {
  name: string;
  phone: string;
  email: string;
  password: string;
  is_active: boolean;
  is_creator: boolean;
  refresh_token: string;
}

@Table({ modelName: 'Admins' })
export class Admin extends Model<Admin, IAdminInter> {
  @ApiProperty({ example: 1, description: 'Unique identifier for the admin' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Name of the admin' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({
    example: '123456789',
    description: 'Phone number of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the admin is active or not',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // Defaults to true for new admins
  })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the admin is a creator or not',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // Defaults to false for new admins
  })
  is_creator: boolean;

  @ApiProperty({
    example: '9t4nty3t93v0qtyq3to9y3vtyvtyvnmvqwtvy',
    description: 'Refresh token of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  refresh_token: string;
}
