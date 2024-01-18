import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfig, awsConfigObject, ConfigCoreModule } from '@backend/config';
import { wolverineConfigObject } from '@backend/wolverine';
import { HealthModule } from '@backend/infrastructure';
import { WolverineHealthIndicatorsProvider } from '@backend/wolverine';
import { GraphqlCoreModule } from '@backend/wolverine';
import { AWSSdkModule } from '@backend/awsModule';
import { ConfigType } from '@nestjs/config';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

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
      serviceObjects: [{ client: DynamoDB }],
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
export class WolverineMainModule {}
