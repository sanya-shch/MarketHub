import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { assertStoreOwner } from 'src/common/ownership';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string, userId: string) {
    await assertStoreOwner(this.prisma, storeId, userId);

    return this.prisma.category.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async create(storeId: string, userId: string, dto: CategoryDto) {
    await assertStoreOwner(this.prisma, storeId, userId);

    return this.prisma.category.create({
      data: {
        title: dto.title,
        description: dto.description,
        storeId,
      },
    });
  }

  async update(id: string, userId: string, dto: CategoryDto) {
    await this.assertOwned(id, userId);

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.assertOwned(id, userId);

    const inUse = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (inUse) {
      throw new ConflictException(
        'Category is used by products: move or delete them first',
      );
    }

    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  private async assertOwned(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, store: { userId } },
      select: { id: true },
    });

    if (!category) throw new NotFoundException('Category not found');
  }
}
