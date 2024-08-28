import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsNotEmpty()
  total: number;
}


