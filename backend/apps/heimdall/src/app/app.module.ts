import { Module } from '@nestjs/common';
import {
  UploadModule,
  ExporterModule,
  HeimdallHealthIndicatorsProvider,
  heimdallConfigObject,
} from '@backend/heimdall';
import { LoggerModule } from '@backend/logger';
import { awsConfig, awsConfigObject, ConfigCoreModule } from '@backend/config';
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
      useFactory: (config: ConfigType<typeof awsConfig>) => {
        return {
          region: config.region!,
          credentials: {
            secretAccessKey: config.secretKey!,
            accessKeyId: config.accessKey!,
          },
        };
      },
      inject: [awsConfig.KEY],
    }),
    ExporterModule,
  ],
})
export class HeimdallMainModule {}
