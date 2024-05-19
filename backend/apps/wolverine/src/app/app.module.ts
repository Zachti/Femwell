import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import {
  /**awsConfig**/ awsConfigObject,
  ConfigCoreModule, redisConfigObject,
} from '@backend/config';
import {
  QuestionnaireModule,
  LiveChatModule,
  wolverineConfigObject,
  PrismaModule,
} from '@backend/wolverine';
import { HealthModule, LoggerMiddleware } from '@backend/infrastructure';
import { WolverineHealthIndicatorsProvider } from '@backend/wolverine';
import { GraphqlCoreModule, ErrorModule } from '@backend/wolverine';
import { HttpModule } from '@nestjs/axios';
import { CacheCoreModule } from '@backend/infrastructure';
// import { AWSSdkModule } from '@backend/awsModule';
// import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    GraphqlCoreModule,
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [wolverineConfigObject, awsConfigObject, redisConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(WolverineHealthIndicatorsProvider),
    // AWSSdkModule.forRootWithAsyncOptions({
    //   serviceObjects: [{ client: '' }],
    //   useFactory: (config: ConfigType<typeof awsConfig>) => {
    //     return {
    //       region: config.region,
    //       credentials: {
    //         secretAccessKey: config.secretKey,
    //         accessKeyId: config.accessKey,
    //       },
    //     };
    //   },
    //   inject: [awsConfig.KEY],
    // }),
    LiveChatModule,
    QuestionnaireModule,
    PrismaModule,
    ErrorModule,
    HttpModule,
    CacheCoreModule,
  ],
})
export class WolverineMainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
