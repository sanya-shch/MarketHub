import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 5001;

  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(PORT, '0.0.0.0');

  Logger.log(`🚀 Server is running on: http://localhost:${PORT}`, 'Bootstrap');
}
void bootstrap();
