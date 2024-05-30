import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import {
  awsConfig,
  awsConfigObject,
  commonConfig,
  ConfigCoreModule,
  redisConfigObject,
} from '@backend/config';
import {
  QuestionnaireModule,
  LiveChatModule,
  wolverineConfigObject,
  PrismaModule,
  SqsModule,
  SnsModule,
} from '@backend/wolverine';
import { HealthModule, LoggerMiddleware } from '@backend/infrastructure';
import { WolverineHealthIndicatorsProvider } from '@backend/wolverine';
import { GraphqlCoreModule, ErrorModule } from '@backend/wolverine';
import { HttpModule } from '@nestjs/axios';
import { CacheCoreModule } from '@backend/infrastructure';
import { AWSSdkModule } from '@backend/awsModule';
import { ConfigType } from '@nestjs/config';
import { SNS } from '@aws-sdk/client-sns';
import { SQS } from '@aws-sdk/client-sqs';

@Module({
  imports: [
    GraphqlCoreModule,
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [
        wolverineConfigObject,
        awsConfigObject,
        redisConfigObject,
      ],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(WolverineHealthIndicatorsProvider),
    AWSSdkModule.forRootWithAsyncOptions({
      serviceObjects: [{ client: SNS }, { client: SQS }],
      useFactory: (
        commonCfg: ConfigType<typeof commonConfig>,
        awsCfg: ConfigType<typeof awsConfig>,
      ) => {
        return commonCfg.isLiveEnv ? {} : awsCfg.localDevConfigOverride;
      },
      inject: [commonConfig.KEY, awsConfig.KEY],
    }),
    LiveChatModule,
    QuestionnaireModule,
    PrismaModule,
    ErrorModule,
    HttpModule,
    CacheCoreModule,
    SqsModule,
    SnsModule,
  ],
})
export class WolverineMainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
