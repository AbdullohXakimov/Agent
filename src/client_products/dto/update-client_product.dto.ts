import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateClientProductDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the client (optional)',
  })
  @IsOptional()
  @IsNumber()
  readonly clientId?: number;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the product (optional)',
  })
  @IsOptional()
  @IsNumber()
  readonly productId?: number;

  @ApiProperty({
    example: 5,
    description: 'Amount of the product for the client (optional)',
  })
  @IsOptional()
  @IsNumber()
  readonly amount?: number;
}
