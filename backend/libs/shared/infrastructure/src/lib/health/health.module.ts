import { DynamicModule, Module, Type } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from './types';
import { HEALTH_INDICATORS_PROVIDER } from './constants';

@Module({})
export class HealthModule {
  static forRoot(
    indicatorsProvider: Type<HealthIndicatorsProvider>,
  ): DynamicModule {
    return {
      module: HealthModule,
      providers: [
        {
          provide: HEALTH_INDICATORS_PROVIDER,
          useClass: indicatorsProvider,
        },
      ],
      imports: [TerminusModule.forRoot({ errorLogStyle: 'json' })],
      controllers: [HealthController],
    };
  }
}
