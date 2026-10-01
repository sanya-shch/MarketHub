import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(userId: string, dto: OrderDto) {
    // the same product may arrive in several lines: merge them
    const quantities = new Map<string, number>();

    for (const item of dto.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    // prices and stores are taken from the DB, never from the client
    const products = await this.prisma.product.findMany({
      where: { id: { in: [...quantities.keys()] } },
      select: { id: true, price: true, storeId: true },
    });

    if (products.length !== quantities.size) {
      throw new BadRequestException('Some products do not exist anymore');
    }

    const orderItems = products.map(product => ({
      quantity: quantities.get(product.id)!,
      price: product.price, // price snapshot at the moment of purchase
      productId: product.id,
      storeId: product.storeId,
    }));

    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // status is always the DB default (PENDING): "paid" must come from a
    // payment provider, not from the request body
    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });
  }
}
