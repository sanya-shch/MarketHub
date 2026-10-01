import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto } from './dto/color.dto';
import { assertStoreOwner } from 'src/common/ownership';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string, userId: string) {
    await assertStoreOwner(this.prisma, storeId, userId);

    return this.prisma.color.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(id: string, userId: string) {
    const color = await this.prisma.color.findFirst({
      where: { id, store: { userId } },
    });

    if (!color) throw new NotFoundException('Color not found');

    return color;
  }

  async create(storeId: string, userId: string, dto: ColorDto) {
    await assertStoreOwner(this.prisma, storeId, userId);

    return this.prisma.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });
  }

  async update(id: string, userId: string, dto: ColorDto) {
    await this.getById(id, userId);

    return this.prisma.color.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    return this.prisma.color.delete({
      where: {
        id,
      },
    });
  }
}
