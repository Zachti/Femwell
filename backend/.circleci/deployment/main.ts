import { CommandFactory } from 'nest-commander';
import { DeploymentModule } from './deployment.module';

async function bootstrap() {
  await CommandFactory.run(DeploymentModule, [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ]);
}

bootstrap();
