import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        stores: true,
        favorites: {
          include: {
            category: true,
          },
        },
        orders: true,
      },
    });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });

    return user;
  }

  /** Only for credential checks. Never return this object to the client. */
  async getByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { password: false },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });
  }

  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }

  async toggleFavorite(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    const isFavorite = await this.prisma.user.findFirst({
      where: { id: userId, favorites: { some: { id: productId } } },
      select: { id: true },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [isFavorite ? 'disconnect' : 'connect']: { id: productId },
        },
      },
    });

    return true;
  }
}
