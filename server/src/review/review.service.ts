import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { assertStoreOwner } from 'src/common/ownership';
import { isUniqueViolation } from 'src/common/prisma-errors';

const REVIEW_USER_SELECT = { id: true, name: true, picture: true } as const;

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string, userId: string) {
    await assertStoreOwner(this.prisma, storeId, userId);

    return this.prisma.review.findMany({
      where: {
        storeId,
      },
      include: {
        user: { select: REVIEW_USER_SELECT },
      },
    });
  }

  async getById(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id, userId },
      include: {
        user: { select: REVIEW_USER_SELECT },
      },
    });

    if (!review) throw new NotFoundException('Review not found');

    return review;
  }

  async create(
    userId: string,
    productId: string,
    storeId: string,
    dto: ReviewDto,
  ) {
    // The store comes from the product itself, the URL value must match it.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product || product.storeId !== storeId) {
      throw new NotFoundException('Product not found');
    }

    try {
      return await this.prisma.review.create({
        data: {
          text: dto.text,
          rating: dto.rating,
          product: {
            connect: {
              id: productId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          store: {
            connect: {
              id: storeId,
            },
          },
        },
      });
    } catch (error) {
      // @@unique([userId, productId]): one review per user and product
      if (isUniqueViolation(error)) {
        throw new ConflictException('You have already reviewed this product');
      }

      throw error;
    }
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    return this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
