import { RegisterRequest } from './dto/registerRequest.input';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserData, ISignUpResult, CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Inject, Injectable } from '@nestjs/common';
import { vaultConfig } from '../config/vaultConfig';
import { ConfigType } from '@nestjs/config';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { LoggerService } from '@backend/logger';
import { InjectCognitoToken } from './providers/cognito.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectCognitoToken()
    private readonly userPool: CognitoUserPool,
    @Inject(vaultConfig.KEY)
    private readonly vaultCfg: ConfigType<typeof vaultConfig>,
    private readonly logger: LoggerService,
  ) {}

  registerUser(registerRequest: RegisterRequest): Promise<ISignUpResult> {
    const { name, email, password, phoneNumber } = registerRequest;
    this.logger.info(`${name} signed up.`);
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber || '',
          }),
        ],
        [],
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  authenticateUser(authenticateRequest: AuthenticateRequest): Promise<CognitoUserSession> {
    const authDetails = new AuthenticationDetails({
      Username: authenticateRequest.name,
      Password: authenticateRequest.password,
    });
    const userData: ICognitoUserData = {
      Username: authenticateRequest.name,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);
    this.logger.info(`${authenticateRequest.name} tries to log in.`);
    return new Promise((resolve, reject) => {
      return user.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  }

  confirmUser(confirmUserRequest: ConfirmUserRequest) {
    const userData: ICognitoUserData = {
      Username: confirmUserRequest.email,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);

    this.logger.info(
      `${confirmUserRequest.email} confirmed his email and now has been verified.`,
    );

    return new Promise((resolve, reject) => {
      return user.confirmRegistration(confirmUserRequest.code, true, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
