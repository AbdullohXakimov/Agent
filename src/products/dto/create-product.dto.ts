import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  
  @ApiProperty({
    example: 'Product Name',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 100,
    description: 'Price of the product',
  })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiProperty({
    example: 50,
    description: 'Amount of the product available in stock',
  })
  @IsNumber()
  @Min(0)
  readonly amount: number;
}
