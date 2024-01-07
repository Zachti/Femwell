import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfigObject, ConfigCoreModule } from '@backend/config';
import { HealthModule } from '@backend/infrastructure';
import { dendenConfigObject, DendenHealthIndicatorsProvider, VideoStreamModule } from '@backend/denden';

@Module({
  imports: [
    LoggerModule.forRoot({ serviceName: 'denden' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [awsConfigObject, dendenConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(DendenHealthIndicatorsProvider),
    VideoStreamModule
    ],
})
export class DendenMainModule {}
