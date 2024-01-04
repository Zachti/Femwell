import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfigObject, DynamicConfigModule } from '@backend/config';
import { wolverineConfigObject } from '@backend/wolverine';
import { HealthModule } from '@backend/infrastructure';
import { WolverineHealthIndicatorsProvider } from '@backend/wolverine';
import { GraphqlCoreModule } from '@backend/wolverine';

@Module({
  imports: [
    GraphqlCoreModule,
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [wolverineConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(WolverineHealthIndicatorsProvider),
  ],
})
export class WolverineMainModule {}
