import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { DynamicConfigModule } from '@backend/config';
import { vaultConfigObject, AuthModule } from '@backend/vault';
import { LoggerModule } from '@backend/logger';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
    }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [vaultConfigObject],
      validationOptions: { presence: 'required' },
    }),
    AuthModule,
    LoggerModule.forRoot({ serviceName: 'vault' }),
    ThrottlerModule.forRoot({
          throttlers: [
            {
              name: 'vault',
              limit: 20,
              ttl: 600000
            }
          ]
    }),
  ],
})
export class VaultCoreModule {}
