import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsString({ message: 'Product ID must be a string' })
  productId: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(99, { message: 'Quantity is too large' })
  quantity: number;
}

// Price, store and status are deliberately NOT part of the request:
// the server takes them from the database.
export class OrderDto {
  @IsArray({ message: 'There are no items in the order' })
  @ArrayMinSize(1, { message: 'There are no items in the order' })
  @ArrayMaxSize(50, { message: 'Too many items in the order' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
