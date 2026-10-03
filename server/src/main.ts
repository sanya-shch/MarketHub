import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const clientUrl = process.env.CLIENT_URL;

  // fail fast: without it CORS would silently reject every browser request
  if (!clientUrl) throw new Error('CLIENT_URL is not set');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app, clientUrl);

  const PORT = process.env.PORT || 5001;

  await app.listen(PORT, '0.0.0.0');

  Logger.log(`🚀 Server is running on: http://localhost:${PORT}`, 'Bootstrap');
}
void bootstrap();
