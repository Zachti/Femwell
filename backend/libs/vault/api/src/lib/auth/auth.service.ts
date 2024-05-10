import { RegisterRequest } from './dto/registerRequest.input';
import { DeleteUserRequest } from './dto/deleteUserRequest.input';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  ICognitoUserData,
} from 'amazon-cognito-identity-js';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { LoggerService } from '@backend/logger';
import { Role } from '@backend/infrastructure';
import { InjectCognitoToken } from './providers/cognito.provider';
import { signUpUser, userSession } from './interfaces/inrefaces';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from '@backend/config';
import { ConfigType } from '@nestjs/config';
import { InjectWolverineSdk, Sdk } from '../wolverine-datasource';

@Injectable()
export class AuthService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsCfg: ConfigType<typeof awsConfig>,
    @InjectCognitoToken()
    private readonly userPool: CognitoUserPool,
    @InjectWolverineSdk()
    private readonly wolverineSdk: Sdk,
    private readonly logger: LoggerService,
  ) {}

  registerUser(registerRequest: RegisterRequest): Promise<signUpUser> {
    const { name, email, password, phoneNumber } = registerRequest;
    this.logger.info(`${name} trying to sign up.`);
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'name', Value: name }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          //new CognitoUserAttribute({ Name: 'role', Value: Role.User }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber || '+972535554444',
          }),
        ],
        [],
        async (err, result) => {
          if (!result) {
            reject(err);
          } else {
            this.logger.info(
              `user created in cognito user pool: ${this.userPool.getUserPoolId()}`,
            );
            const id = result.userSub;
            await this.wolverineSdk.sendWolverineMutation(
              'create',
              {
                email,
                id,
              },
              this.logger,
            );
            resolve({
              email,
              id,
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
            id: result.getIdToken().decodePayload()['sub'],
            isValid: result.isValid(),
            refreshToken: result.getRefreshToken().getToken(),
            jwt: result.getAccessToken().getJwtToken(),
          }),
        onFailure: (err) => reject(err),
      });
    });
  }

  confirmUser(confirmUserRequest: ConfirmUserRequest) {
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
          resolve(result);
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
      UserPoolId: this.awsCfg.userPoolId,
    };

    const cognito = new CognitoIdentityProvider({
      region: this.awsCfg.region,
      credentials: {
        secretAccessKey: this.awsCfg.secretKey,
        accessKeyId: this.awsCfg.accessKey,
        sessionToken: this.awsCfg.sessionToken,
      },
    });

    const userData = await cognito.adminGetUser(deleteUserData);
    const id = userData.UserAttributes?.find(
      (attribute) => attribute.Name === 'sub',
    )?.Value;

    return new Promise((resolve, reject) => {
      return cognito.adminDeleteUser(deleteUserData, (err) => {
        if (err) reject(err);
        this.logger.info(
          `${deleteUserRequest.username} account deleted from cognito.`,
        );
        this.wolverineSdk.sendWolverineMutation('delete', { id }, this.logger);
        resolve('User deleted successfully!');
      });
    });
  }
}
