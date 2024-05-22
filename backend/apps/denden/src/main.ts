/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { DendenMainModule } from './app/app.module';
import { appsPrefix } from '@backend/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(DendenMainModule, { cors: true });
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(appsPrefix.Denden);
  await app.listen(port);
}

bootstrap();
