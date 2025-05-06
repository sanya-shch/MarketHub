import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(userId: string, dto: OrderDto) {
    const orderItems = dto.items.map(item => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
    }));

    const total = dto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems,
        },
        user: {
          connect: {
            id: userId,
          },
        },
        total,
      },
    });

    return order;
  }
}
