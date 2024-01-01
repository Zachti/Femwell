import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfigObject, DynamicConfigModule } from '@backend/config';
import { wolverineConfigObject } from '@backend/wolverine';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
    }),
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [wolverineConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),],
  providers: [],
})
export class WolverineCoreModule {}
