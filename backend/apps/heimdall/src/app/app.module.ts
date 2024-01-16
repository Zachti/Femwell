import { Module } from '@nestjs/common';
import { UploadModule } from '@backend/heimdall';
import { LoggerModule } from '@backend/logger';
import {awsConfig, awsConfigObject, ConfigCoreModule} from '@backend/config';
import { heimdallConfigObject } from '@backend/heimdall';
import { HealthModule } from '@backend/infrastructure';
import { HeimdallHealthIndicatorsProvider } from '@backend/heimdall';
import {AWSSdkModule} from "@backend/awsModule";
import {ConfigType} from "@nestjs/config";
import { S3 } from '@aws-sdk/client-s3';

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
      serviceObjects: { client: S3 },
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
  ],
})
export class HeimdallMainModule {}
