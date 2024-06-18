import { NestFactory } from '@nestjs/core';
import { VaultMainModule } from './app/app.module';
import { appsPrefix } from '@backend/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(VaultMainModule, {
    cors: { origin: '*' },
  });
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(appsPrefix.Vault);
  await app.listen(port);
}

bootstrap();
