import { Module } from '@nestjs/common';
import {
  UploadModule,
  ExporterModule,
  HeimdallHealthIndicatorsProvider,
  heimdallConfigObject,
} from '@backend/heimdall';
import { LoggerModule } from '@backend/logger';
import {
  awsConfig,
  awsConfigObject,
  commonConfig,
  ConfigCoreModule,
} from '@backend/config';
import { HealthModule } from '@backend/infrastructure';
import { AWSSdkModule } from '@backend/awsModule';
import { ConfigType } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { SES } from '@aws-sdk/client-ses';

@Module({
  imports: [
    UploadModule,
    LoggerModule.forRoot({ serviceName: 'heimdall' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [heimdallConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(HeimdallHealthIndicatorsProvider),
    AWSSdkModule.forRootWithAsyncOptions({
      serviceObjects: [{ client: S3 }, { client: SES }],
      useFactory: (
        awsCfg: ConfigType<typeof awsConfig>,
        config: ConfigType<typeof commonConfig>,
      ) => {
        return config.isLiveEnv ? {} : awsCfg.localDevConfigOverride;
      },
      inject: [awsConfig.KEY, commonConfig.KEY],
    }),
    ExporterModule,
  ],
})
export class HeimdallMainModule {}
