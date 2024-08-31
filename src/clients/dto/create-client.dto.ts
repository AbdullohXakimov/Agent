import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the client',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the client',
  })
  @IsPhoneNumber(null) // null allows any country code
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Email address of the client',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Address of the client',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the client',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
