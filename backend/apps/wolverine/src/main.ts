/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { WolverineMainModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(WolverineMainModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
