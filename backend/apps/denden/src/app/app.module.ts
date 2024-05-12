import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import {awsConfig, awsConfigObject, commonConfig, ConfigCoreModule} from '@backend/config';
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
      serviceObjects: [{ client: CloudFront }],
      useFactory: (
        awsCfg: ConfigType<typeof awsConfig>,
        config: ConfigType<typeof commonConfig>,
      ) => {
        return config.isLiveEnv ? {} : awsCfg.localDevConfigOverride;
      },
      inject: [awsConfig.KEY, commonConfig.KEY],
    }),
    ],
})
export class DendenMainModule {}
