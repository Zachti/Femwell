import { NestFactory } from '@nestjs/core';
import { WolverineMainModule } from './app/app.module';
import { appsPrefix } from '@backend/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(WolverineMainModule, {
    cors: { origin: '*' },
  });
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(appsPrefix.Wolverine);
  await app.listen(port);
}

bootstrap();
