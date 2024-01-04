import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { awsConfigObject, DynamicConfigModule } from '@backend/config';
import { vaultConfigObject, AuthModule } from '@backend/vault';
import { LoggerModule } from '@backend/logger';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { path: join(process.cwd(), 'apps/vt/src/graphQL/schema.gql'), federation: 2 },
    }),
    DynamicConfigModule.forRoot({
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
              ttl: 600000
            }
          ]
    }),
  ],
})
export class VaultMainModule {}
