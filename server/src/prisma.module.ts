import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * One PrismaService (= one connection pool) for the whole app. Before, every
 * feature module listed PrismaService in its own `providers`, which created a
 * separate PrismaClient with its own pool per module.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
