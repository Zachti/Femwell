import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import {
  awsConfig,
  awsConfigObject,
  commonConfig,
  ConfigCoreModule,
} from '@backend/config';
import { HealthModule, LoggerMiddleware } from '@backend/infrastructure';
import {
  dendenConfigObject,
  DendenHealthIndicatorsProvider,
  VideoStreamModule,
} from '@backend/denden';
import { AWSSdkModule } from '@backend/awsModule';
import { ConfigType } from '@nestjs/config';
import { CloudFront } from '@aws-sdk/client-cloudfront';
import {HttpModule} from "@nestjs/axios";

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
    HttpModule,
  ],
})
export class DendenMainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
