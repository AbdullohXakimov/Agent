import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Updated name of the client (optional)',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Updated phone number of the client (optional)',
  })
  @IsOptional()
  @IsPhoneNumber(null) // null allows any country code
  readonly phone?: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Updated email address of the client (optional)',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Updated address of the client (optional)',
  })
  @IsOptional()
  @IsString()
  readonly address?: string;
}
