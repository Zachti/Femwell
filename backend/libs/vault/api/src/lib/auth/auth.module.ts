import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CognitoProvider } from './providers/cognito.provider';
import { AuditModule } from '@backend/auditService';
import { wolverineSdkProvider } from '../wolverine-datasource';
import { GraphqlDatasourceModule } from '../graphql-datasource/graphql-datasource.module';
import { ConfigType } from '@nestjs/config';
import { vaultConfig } from '../config/vaultConfig';

@Module({
  imports: [
    AuditModule.forFeature({ namespace: 'auth' }),
    GraphqlDatasourceModule.registerAsync({
      injectionKey: 'WOLVERINE_GQL_DS',
      useFactory: (config: ConfigType<typeof vaultConfig>) => {
        return {
          endpoint: config.wolverineGraphqlEndpoint,
        };
      },
      inject: [vaultConfig.KEY],
    }),
  ],
  providers: [AuthResolver, AuthService, CognitoProvider, wolverineSdkProvider],
})
export class AuthModule {}
