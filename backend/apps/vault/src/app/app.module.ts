import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import {
  awsConfig,
  awsConfigObject,
  commonConfig,
  ConfigCoreModule,
} from '@backend/config';
import {
  vaultConfigObject,
  AuthModule,
  VaultHealthIndicatorsProvider,
} from '@backend/vault';
import { LoggerModule } from '@backend/logger';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuditModule } from '@backend/auditService';
import { ConfigType } from '@nestjs/config';
import { HealthModule, LoggerMiddleware } from '@backend/infrastructure';
import { HttpModule } from '@nestjs/axios';
import { AWSSdkModule } from '@backend/awsModule';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: join(process.cwd(), 'apps/vt/src/graphQL/schema.gql'),
        federation: 2,
      },
      useGlobalPrefix: true,
    }),
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [vaultConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),
    AuthModule,
    LoggerModule.forRoot({ serviceName: 'vault' }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'vault',
          limit: 20,
          ttl: 600000,
        },
      ],
    }),
    AuditModule.forRootAsync({
      useFactory: (config: ConfigType<typeof awsConfig>) => {
        return { streamARN: config.streamARN };
      },
      inject: [awsConfig.KEY],
    }),
    AWSSdkModule.forRootWithAsyncOptions({
      serviceObjects: [{ client: CognitoIdentityProvider }],
      useFactory: (
        commonCfg: ConfigType<typeof commonConfig>,
        awsCfg: ConfigType<typeof awsConfig>,
      ) => {
        return commonCfg.isLiveEnv ? {} : awsCfg.localDevConfigOverride;
      },
      inject: [commonConfig.KEY, awsConfig.KEY],
    }),
    HealthModule.forRoot(VaultHealthIndicatorsProvider),
    HttpModule,
  ],
})
export class VaultMainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
