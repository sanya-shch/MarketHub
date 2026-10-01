import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // The password hash must never leave the DB layer by accident (nested
    // `include: { user: true }`, profile endpoints, ...). It is omitted
    // globally and requested explicitly only for login:
    // `findUnique({ ..., omit: { password: false } })`.
    super({ omit: { user: { password: true } } });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
