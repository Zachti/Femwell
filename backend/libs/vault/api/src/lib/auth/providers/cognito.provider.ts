import { Inject, Provider } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { awsConfig } from '@backend/config';
import { ConfigType } from '@nestjs/config';

export const InjectCognitoToken = () => Inject(CognitoToken);

export const CognitoToken = Symbol('COGNITO_TOKEN');

export const CognitoProvider: Provider = {
  provide: CognitoToken,
  useFactory: (config: ConfigType<typeof awsConfig>) => {
    return new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
    });
  },
  inject: [awsConfig.KEY],
};
