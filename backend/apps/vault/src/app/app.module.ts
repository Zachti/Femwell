import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicConfigModule } from '@backend/config';
import { vaultConfigObject, AuthModule } from '@backend/vault';
import { LoggerModule } from '@backend/logger';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [vaultConfigObject],
      validationOptions: { presence: 'required' },
    }),
    AuthModule,
    LoggerModule.forRoot({ serviceName: 'vault' }),
  ],
})
export class VaultCoreModule {}
