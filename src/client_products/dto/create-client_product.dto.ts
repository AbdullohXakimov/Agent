import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateClientProductDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the client',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly clientId: number;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the product',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly productId: number;

  @ApiProperty({
    example: 5,
    description: 'Amount of the product for the client',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
