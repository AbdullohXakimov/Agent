import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123456789',
    description: 'Phone number of the admin',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address of the admin',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the admin',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the admin is active or not',
  })
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the admin is a creator or not',
  })
  @IsBoolean()
  @IsNotEmpty()
  is_creator: boolean;
}
