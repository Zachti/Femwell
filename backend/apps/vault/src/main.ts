/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { VaultMainModule } from './app/app.module';
import { appsPrefix } from '@backend/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(VaultMainModule , {cors: true});
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(appsPrefix.Vault);
  await app.listen(port);
}

bootstrap();
