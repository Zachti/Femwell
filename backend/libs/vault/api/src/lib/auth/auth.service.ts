import { RegisterRequest } from './dto/registerRequest.entity';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserData,
} from 'amazon-cognito-identity-js';
import { Inject, Injectable } from '@nestjs/common';
import { authConfig } from './config/authConfig';
import { ConfigType } from '@nestjs/config';
import { AuthenticateRequest } from './dto/authenticateRequest.entity';
import { ConfirmUserRequest } from './dto/confirmUserRequest.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPool: CognitoUserPool,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authCfg.userPoolId,
      ClientId: this.authCfg.clientId,
    });
  }

  registerUser(registerRequest: RegisterRequest) {
    const { name, email, password, phoneNumber } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  authenticateUser(authenticateRequest: AuthenticateRequest) {
    const authDetails = new AuthenticationDetails({
      Username: authenticateRequest.name,
      Password: authenticateRequest.password,
    });
    const userData: ICognitoUserData = {
      Username: authenticateRequest.name,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);
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

    return new Promise((resolve, reject) => {
      user.confirmRegistration(confirmUserRequest.code, true, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
