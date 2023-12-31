import { Inject, Provider } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const InjectCognitoToken = () => Inject(CognitoToken)

export const CognitoToken = Symbol('COGNITO_TOKEN')

export const CognitoProvider: Provider = {
  provide: CognitoToken,
  useFactory: () => {
    return new CognitoUserPool({
      UserPoolId: process.env['COGNITO_USER_POOL_ID'] as string,
      ClientId: process.env['COGNITO_CLIENT_ID'] as string,
    })
  },
}
