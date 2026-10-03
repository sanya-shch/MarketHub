import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(200)
  @Post('place')
  @Auth()
  placeOrder(@CurrentUser('id') userId: string, @Body() dto: OrderDto) {
    return this.orderService.placeOrder(userId, dto);
  }
}
