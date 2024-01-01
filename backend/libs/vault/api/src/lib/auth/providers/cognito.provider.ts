import { Inject, Provider } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';

export const InjectCognitoToken = () => Inject(CognitoToken)

export const CognitoToken = Symbol('COGNITO_TOKEN')

export const CognitoProvider: Provider = {
  provide: CognitoToken,
  useFactory: (configService: ConfigService) => {
    return new CognitoUserPool({
      UserPoolId: configService.get<string>('COGNITO_USER_POOL_ID')!,
      ClientId: configService.get<string>('COGNITO_CLIENT_ID')!,
    })
  },
inject: [ConfigService]
}
