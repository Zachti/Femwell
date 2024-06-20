import { NestFactory } from '@nestjs/core';
import { DendenMainModule } from './app/app.module';
import { appsPrefix } from '@backend/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(DendenMainModule, {
    cors: {
      origin: '*',
    },
  });
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(appsPrefix.Denden);
  await app.listen(port);
}

bootstrap();
