import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

/** Everything that is configured on the app itself; shared by main.ts and the tests. */
export function configureApp(app: NestExpressApplication, clientUrl: string) {
  // Behind a reverse proxy / load balancer set TRUST_PROXY to the number of
  // proxies (usually 1), otherwise every client has the proxy's IP and the
  // rate limiter treats them as one.
  if (process.env.TRUST_PROXY) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY));
  }

  app.use(
    helmet({
      // images from /uploads are loaded by the client app on another origin
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: [clientUrl],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that have no validation decorator
      forbidNonWhitelisted: true, // ...and reject the request instead of ignoring them
      transform: true, // plain body/query -> DTO instance (numbers from query strings etc.)
    }),
  );

  app.enableShutdownHooks();
}
