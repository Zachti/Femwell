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
          options: {
            headers: {
              context: JSON.stringify({
                token_use: 'access',
                client_id: 'system',
                version: 1,
                username: 'vault',
                scope: 'internal',
                sub: 'vault',
                iss: 'system',
                exp: 1620000000,
                iat: 1619990000,
                auth_time: 1619980000,
                jti: 'vault',
                origin_jti: 'vault',
              }),
            },
          },
        };
      },
      inject: [vaultConfig.KEY],
    }),
  ],
  providers: [AuthResolver, AuthService, CognitoProvider, wolverineSdkProvider],
})
export class AuthModule {}
