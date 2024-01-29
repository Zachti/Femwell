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
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from '@backend/config';
import { ConfigType } from '@nestjs/config';
import { GraphQLClient, gql, Variables } from 'graphql-request';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  private readonly client: GraphQLClient;
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsCfg: ConfigType<typeof awsConfig>,
    @InjectCognitoToken()
    private readonly userPool: CognitoUserPool,
    private readonly logger: LoggerService,
  ) {
    this.client = new GraphQLClient('');
  }

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
            result.user.getSession(
              async (err: null, session: CognitoUserSession) => {
                if (err) {
                  reject(err);
                }
                this.logger.info(
                  `user created in cognito user pool: ${this.userPool.getUserPoolId()}`,
                );
                const id = session.getIdToken().decodePayload()[
                  'identities'
                ].userId;
                await this.sendWolverineMutation('create', { email, id });
                resolve({
                  id,
                  isValid: session.isValid(),
                  refreshToken: session.getRefreshToken().getToken(),
                  jwt: session.getAccessToken().getJwtToken(),
                });
              },
            );
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
      UserPoolId: this.awsCfg.userPoolId,
    };

    const cognito = new CognitoIdentityProvider({
      region: this.awsCfg.region,
      credentials: {
        secretAccessKey: this.awsCfg.secretKey!,
        accessKeyId: this.awsCfg.accessKey!,
      },
    });

    const userData = await cognito.adminGetUser(deleteUserData);
    const id = userData.UserAttributes?.find(
      (attribute) => attribute.Name === 'sub',
    );

    return new Promise((resolve, reject) => {
      return cognito.adminDeleteUser(deleteUserData, (err) => {
        if (err) reject(err);
        this.logger.info(
          `${deleteUserRequest.username} account deleted from cognito.`,
        );
        this.sendWolverineMutation('delete', { id });
        resolve('User deleted successfully!');
      });
    });
  }

  private getWolverineMutation(mutation: string) {
    switch (mutation) {
      case 'create':
        return gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {}
  }`;
      case 'delete':
        return gql`
  mutation deleteUser($id: UUID!) {
    deleteUser(id: $id) {}
  }`;
      default:
        this.logger.error('Not Allowed mutation.');
        throw new GraphQLError('Not Allowed mutation.', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
    }
  }

  private async sendWolverineMutation(mutation: string, args: Variables) {
    try {
      await this.client.request(this.getWolverineMutation(mutation), args);
      this.logger.info(`user ${mutation} from Wolverine DB.`, args);
    } catch (e) {
      this.logger.error(
        ` Couldn't ${mutation} user at wolverine DB. user args: ${args}`,
      );
    }
  }
}
