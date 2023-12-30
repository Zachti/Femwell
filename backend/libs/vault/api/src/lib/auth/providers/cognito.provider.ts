import { Inject } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const InjectCognitoToken = () => Inject(CognitoToken)

export const CognitoToken = Symbol('COGNITO_TOKEN')

export const CognitoProvider = {
  provide: CognitoToken,
  useFactory: () => {
    return new CognitoUserPool({
      UserPoolId: process.env['COGNITO_USER_POOL_ID'],
      ClientId: process.env['COGNITO_CLIENT_ID']
    })
  }
}
