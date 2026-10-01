import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

/**
 * Throws 404 (not 403, so the existence of foreign stores is not revealed)
 * unless the store exists and belongs to the user.
 */
export async function assertStoreOwner(
  prisma: PrismaService,
  storeId: string,
  userId: string,
) {
  const store = await prisma.store.findFirst({
    where: { id: storeId, userId },
    select: { id: true },
  });

  if (!store) throw new NotFoundException('Store not found');
}
