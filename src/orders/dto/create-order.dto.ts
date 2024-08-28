import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDTO } from './create-order-item.dto'; // Make sure to import the CreateOrderItemDTO

export class CreateOrderDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ type: [CreateOrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  orders: CreateOrderItemDTO[];

  @ApiProperty({
    example: false,
    description: 'Indicates whether the order is finished',
  })
  @IsBoolean()
  finished: boolean;

  @ApiProperty({
    example: 150.75,
    description: 'Total price for the entire order',
  })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
