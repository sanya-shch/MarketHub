import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dto/product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { assertStoreOwner } from 'src/common/ownership';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private files: FileService,
  ) {}

  /** Public catalog: search, filters, sorting and pagination in one query. */
  async getAll(query: ProductQueryDto) {
    const { searchTerm, categoryId, minPrice, maxPrice, sort, page, limit } =
      query;

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: { gte: minPrice, lte: maxPrice },
      }),
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      sort === 'price_asc'
        ? [{ price: 'asc' }, { id: 'asc' }]
        : sort === 'price_desc'
          ? [{ price: 'desc' }, { id: 'asc' }]
          : [{ createdAt: 'desc' }, { id: 'asc' }]; // `id` keeps pages stable

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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

  async getMostPopular(limit = 6) {
    const sold = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: { productId: { not: null } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const ids = sold.map(item => item.productId as string);

    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: { category: true },
    });

    // `findMany({ id: { in } })` does not keep the order of `ids`
    const byId = new Map(products.map(product => [product.id, product]));

    return ids.flatMap(id => byId.get(id) ?? []);
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
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
      take: 8,
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

    const updated = await this.prisma.product.update({
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

    // images the product no longer has are removed from the disk
    await this.files.deleteUnusedImages(
      product.images.filter(image => !dto.images.includes(image)),
    );

    return updated;
  }

  async delete(id: string, userId: string) {
    const product = await this.getOwned(id, userId);

    const deleted = await this.prisma.product.delete({
      where: {
        id,
      },
    });

    await this.files.deleteUnusedImages(product.images);

    return deleted;
  }

  /** The product must exist and its store must belong to the user. */
  private async getOwned(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, store: { userId } },
      select: { id: true, storeId: true, images: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
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
