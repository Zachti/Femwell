import { RegisterRequest } from './dto/registerRequest.input';
import { DeleteUserRequest } from './dto/deleteUserRequest.input';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserData,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { LoggerService } from '@backend/logger';
import { Role } from '@backend/infrastructure';
import { InjectCognitoToken } from './providers/cognito.provider';
import { userSession } from './interfaces/inrefaces';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { awsConfig } from '@backend/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsCfg: ConfigType<typeof awsConfig>,
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
                id: session.getIdToken().decodePayload()['identities'].userId,
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
            id: result.getIdToken().decodePayload()['identities'].userId,
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
              id: session.getIdToken().decodePayload()['identities'].userId,
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

  async deleteUser(deleteUserRequest: DeleteUserRequest): Promise<string> {

    const deleteUserData = {
      Username: deleteUserRequest.username,
      UserPoolId: this.awsCfg.userPoolId!,
    };

    const cognito = new CognitoIdentityServiceProvider({
      region: this.awsCfg.region!,
      credentials: {
        secretAccessKey:  this.awsCfg.secretKey!,
        accessKeyId: this.awsCfg.accessKey!,
      },
    });

    return new Promise((resolve, reject) => {
      return cognito.adminDeleteUser(deleteUserData, (err) => {
        if (err) reject(err);
              this.logger.info(`${deleteUserRequest.username} account deleted.`);
              resolve('User deleted successfully!');
            })
        });
    }
}
