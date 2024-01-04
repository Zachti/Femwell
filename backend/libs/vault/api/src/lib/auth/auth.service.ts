import { RegisterRequest } from './dto/registerRequest.input';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserData,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { LoggerService } from '@backend/logger';
import { Role } from '@backend/infrastructure';
import { InjectCognitoToken } from './providers/cognito.provider';
import { userSession } from './interfaces/inrefaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectCognitoToken()
    private readonly userPool: CognitoUserPool,
    private readonly logger: LoggerService,
  ) {}

  registerUser(registerRequest: RegisterRequest): Promise<userSession> {
    const { name, email, password, phoneNumber } = registerRequest;
    this.logger.info(`${name} signed up.`);
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'role', Value: Role.User }),
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
            result.user.getSession((err: null, session: CognitoUserSession) => {
              if (err) {
                reject(err);
              }
              resolve({
                isValid: session.isValid(),
                refreshToken: session.getRefreshToken().getToken(),
                jwt: session.getAccessToken().getJwtToken(),
              });
            });
          }
        },
      );
    });
  }

  authenticateUser(
    authenticateRequest: AuthenticateRequest,
  ): Promise<userSession> {
    const authDetails = new AuthenticationDetails({
      Username: authenticateRequest.username,
      Password: authenticateRequest.password,
    });
    const userData: ICognitoUserData = {
      Username: authenticateRequest.username,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    this.logger.info(`${authenticateRequest.username} tries to log in.`);
    return new Promise((resolve, reject) => {
      return cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) =>
          resolve({
            isValid: result.isValid(),
            refreshToken: result.getRefreshToken().getToken(),
            jwt: result.getAccessToken().getJwtToken(),
          }),
        onFailure: (err) => reject(err),
      });
    });
  }

  confirmUser(confirmUserRequest: ConfirmUserRequest): Promise<userSession> {
    const userData: ICognitoUserData = {
      Username: confirmUserRequest.email,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    this.logger.info(
      `${confirmUserRequest.email} confirmed his email and now has been verified.`,
    );

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(
        confirmUserRequest.code,
        true,
        (err, result) => {
          if (err) reject(err);
          result.user.getSession((err: null, session: CognitoUserSession) => {
            if (err) {
              reject(err);
            }
            resolve({
              isValid: session.isValid(),
              refreshToken: session.getRefreshToken().getToken(),
              jwt: session.getAccessToken().getJwtToken(),
            });
          });
        },
      );
    });
  }

  sendConfirmationCode(email: string): Promise<string> {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: () => {
          resolve('Verification code sent');
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async deleteUser(confirmUserRequest: ConfirmUserRequest): Promise<string> {
    const userData = {
      Username: confirmUserRequest.email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return cognitoUser.verifyAttribute('email', confirmUserRequest.code, {
        onSuccess: () => {
          cognitoUser.deleteUser((err) => {
            if (err) {
              reject(err);
            } else {
              this.logger.info(`${confirmUserRequest.email} account deleted.`);
              resolve('Account deleted');
            }
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
