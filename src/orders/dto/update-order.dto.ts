import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateOrderStatusDTO {
  @ApiProperty({ example: true })
  @IsBoolean()
  finished: boolean;
}
