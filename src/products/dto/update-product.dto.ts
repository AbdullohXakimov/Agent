import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Updated Product Name',
    description: 'Updated name of the product (optional)',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 150,
    description: 'Updated price of the product (optional)',
  })
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @ApiProperty({
    example: 75,
    description: 'Updated amount of the product in stock (optional)',
  })
  @IsOptional()
  @IsNumber()
  readonly amount?: number;
}
