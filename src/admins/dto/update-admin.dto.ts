import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ example: 'John Doe', description: 'Name of the admin' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '123456789',
    description: 'Phone number of the admin',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address of the admin',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the admin',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the admin is active or not',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the admin is a creator or not',
  })
  @IsOptional()
  @IsBoolean()
  is_creator?: boolean;
}
