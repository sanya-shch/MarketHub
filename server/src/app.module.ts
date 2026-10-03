import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { FileModule } from './file/file.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // 100 requests per minute and IP for everything; login / register are
    // limited more strictly with @Throttle() in the auth controller.
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 100 }],
      skipIf: () => process.env.NODE_ENV === 'test',
    }),
    AuthModule,
    UserModule,
    ColorModule,
    CategoryModule,
    StoreModule,
    OrderModule,
    FileModule,
    StatisticsModule,
    ProductModule,
    ReviewModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
