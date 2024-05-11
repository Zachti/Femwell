import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfig, awsConfigObject, ConfigCoreModule } from '@backend/config';
import {
  QuestionnaireModule,
  LiveChatModule,
  wolverineConfigObject,
  PrismaModule,
  EventModule,
} from '@backend/wolverine';
import { HealthModule } from '@backend/infrastructure';
import { WolverineHealthIndicatorsProvider } from '@backend/wolverine';
import { GraphqlCoreModule } from '@backend/wolverine';
import { AWSSdkModule } from '@backend/awsModule';
import { ConfigType } from '@nestjs/config';
import { SNS } from '@aws-sdk/client-sns';

@Module({
  imports: [
    GraphqlCoreModule,
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [wolverineConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),
    HealthModule.forRoot(WolverineHealthIndicatorsProvider),
    AWSSdkModule.forRootWithAsyncOptions({
      serviceObjects: [{ client: SNS }],
      useFactory: (config: ConfigType<typeof awsConfig>) => {
        return {
          region: config.region,
          credentials: {
            secretAccessKey: config.secretKey,
            accessKeyId: config.accessKey,
          },
        };
      },
      inject: [awsConfig.KEY],
    }),
    LiveChatModule,
    QuestionnaireModule,
    PrismaModule,
    EventModule,
  ],
})
export class WolverineMainModule {}
