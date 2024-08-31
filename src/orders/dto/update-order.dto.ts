import {
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderItemDTO {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  totalPrice: number;
}

export class UpdateOrderStatusDTO {
  @IsBoolean()
  full: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDTO)
  items?: UpdateOrderItemDTO[];
}
