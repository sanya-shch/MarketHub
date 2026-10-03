import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import 'dayjs/locale/en';
import { PrismaService } from 'src/prisma.service';
import { assertStoreOwner } from 'src/common/ownership';

dayjs.locale('en');

/**
 * Orders that count as sales. Nothing marks an order PAYED yet (there is no
 * payment provider), so PENDING is counted too. When payments are connected,
 * change this to ['PAYED'] and every statistic below follows.
 */
const COUNTED_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PAYED,
];

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getMainStatistics(storeId: string, userId: string) {
    await assertStoreOwner(this.prisma, storeId, userId);

    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);
    const averageRating = await this.calculateAverageRating(storeId);

    return [
      { id: 1, name: 'Revenue', value: totalRevenue },
      { id: 2, name: 'Products', value: productsCount },
      { id: 3, name: 'Categories', value: categoriesCount },
      { id: 4, name: 'Average rating', value: averageRating || 0 },
    ];
  }

  async getMiddleStatistics(storeId: string, userId: string) {
    await assertStoreOwner(this.prisma, storeId, userId);

    const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);

    return {
      monthlySales,
      lastUsers,
    };
  }

  private async calculateTotalRevenue(storeId: string) {
    const [row] = await this.prisma.$queryRaw<{ total: bigint | null }[]>(
      Prisma.sql`
        SELECT COALESCE(SUM(i."price" * i."quantity"), 0) AS total
        FROM "order_item" i
        JOIN "order" o ON o."id" = i."order_id"
        WHERE i."store_id" = ${storeId}
          AND o."status"::text IN (${Prisma.join(COUNTED_STATUSES)})
      `,
    );

    return Number(row?.total ?? 0);
  }

  private async countProducts(storeId: string) {
    const productsCount = await this.prisma.product.count({
      where: { storeId },
    });

    return productsCount;
  }

  private async countCategories(storeId: string) {
    const categoriesCount = await this.prisma.category.count({
      where: { storeId },
    });

    return categoriesCount;
  }

  private async calculateAverageRating(storeId: string) {
    const averageRating = await this.prisma.review.aggregate({
      where: { storeId },
      _avg: { rating: true },
    });

    return averageRating._avg.rating;
  }

  private async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prisma.order.findMany({
      orderBy: { createdAt: 'asc' }, // the chart goes left to right in time
      where: {
        status: { in: COUNTED_STATUSES },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        items: {
          some: { storeId },
        },
      },
      include: {
        // only this store's items, otherwise other stores' sales leak in
        items: { where: { storeId } },
      },
    });

    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    };

    const salesByDate = new Map<string, number>();

    salesRaw.forEach(order => {
      const formattedDate = formatDate(new Date(order.createdAt));
      const total = order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      if (salesByDate.has(formattedDate)) {
        salesByDate.set(formattedDate, salesByDate.get(formattedDate)! + total);
      } else {
        salesByDate.set(formattedDate, total);
      }
    });

    const monthlySales = Array.from(salesByDate, ([date, value]) => ({
      date,
      value,
    }));

    return monthlySales;
  }

  /** The 5 most recent customers of the store and what they spent in their last order. */
  private async getLastUsers(storeId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { in: COUNTED_STATUSES },
        items: { some: { storeId } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // enough to find 5 distinct customers in practice
      select: {
        user: {
          select: { id: true, name: true, email: true, picture: true },
        },
        // only this store's items, with quantity
        items: {
          where: { storeId },
          select: { price: true, quantity: true },
        },
      },
    });

    const lastUsers = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        picture: string;
        total: number;
      }
    >();

    for (const order of orders) {
      if (lastUsers.size >= 5) break;
      if (lastUsers.has(order.user.id)) continue; // orders are newest first

      lastUsers.set(order.user.id, {
        ...order.user,
        total: order.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        ),
      });
    }

    return [...lastUsers.values()];
  }
}
