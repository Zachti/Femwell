import { Module } from '@nestjs/common';
import { UploadModule } from '@backend/heimdall';
import { LoggerModule } from '@backend/logger';
import { awsConfigObject, DynamicConfigModule } from '@backend/config';
import { heimdallConfigObject } from '@backend/heimdall';
import { HealthModule } from '@backend/infrastructure';
import {
  HeimdallHealthIndicatorsProvider
} from '@backend/heimdall';

@Module({
  imports: [
    UploadModule,
    LoggerModule.forRoot({ serviceName: 'heimdall' }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [heimdallConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(HeimdallHealthIndicatorsProvider)
  ],
})
export class HeimdallMainModule {}
