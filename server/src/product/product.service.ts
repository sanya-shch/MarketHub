import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { assertStoreOwner } from 'src/common/ownership';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
      },
    });
  }

  async getByStoreId(storeId: string) {
    return this.prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        color: true,
        reviews: {
          include: {
            // public endpoint: never expose e-mail & co of reviewers
            user: { select: { id: true, name: true, picture: true } },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: { category: { id: categoryId } },
      include: {
        category: true,
      },
    });

    if (!products) throw new NotFoundException('Products not found');

    return products;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { id: true },
      orderBy: {
        _count: { id: 'desc' },
      },
    });

    const productIds = mostPopularProducts.map(
      item => item.productId as string,
    );

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category?.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }

  async create(storeId: string, userId: string, dto: ProductDto) {
    await assertStoreOwner(this.prisma, storeId, userId);
    await this.assertRefsBelongToStore(storeId, dto);

    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
        storeId,
      },
    });
  }

  async update(id: string, userId: string, dto: ProductDto) {
    const product = await this.getOwned(id, userId);

    await this.assertRefsBelongToStore(product.storeId, dto);

    return this.prisma.product.update({
      where: {
        id,
      },
      // explicit fields only: never spread the request body into `data`
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getOwned(id, userId);

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  /** The product must exist and its store must belong to the user. */
  private async getOwned(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, store: { userId } },
      select: { id: true, storeId: true },
    });

    if (!product?.storeId) throw new NotFoundException('Product not found');

    return { id: product.id, storeId: product.storeId };
  }

  /** Category and color must belong to the same store as the product. */
  private async assertRefsBelongToStore(storeId: string, dto: ProductDto) {
    const [categories, colors] = await Promise.all([
      this.prisma.category.count({ where: { id: dto.categoryId, storeId } }),
      this.prisma.color.count({ where: { id: dto.colorId, storeId } }),
    ]);

    if (!categories) {
      throw new BadRequestException('Category does not belong to this store');
    }

    if (!colors) {
      throw new BadRequestException('Color does not belong to this store');
    }
  }
}
