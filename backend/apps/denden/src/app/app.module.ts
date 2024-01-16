import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import {awsConfig, awsConfigObject, ConfigCoreModule} from '@backend/config';
import { HealthModule } from '@backend/infrastructure';
import { dendenConfigObject, DendenHealthIndicatorsProvider, VideoStreamModule } from '@backend/denden';
import {AWSSdkModule} from "@backend/awsModule";
import {ConfigType} from "@nestjs/config";
import {CloudFront} from "@aws-sdk/client-cloudfront";

@Module({
  imports: [
    LoggerModule.forRoot({ serviceName: 'denden' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [awsConfigObject, dendenConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(DendenHealthIndicatorsProvider),
    VideoStreamModule,
    AWSSdkModule.forRootWithAsyncOptions({
      serviceObjects: { client: CloudFront },
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
export class DendenMainModule {}
