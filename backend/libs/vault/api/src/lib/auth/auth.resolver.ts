import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterRequest } from './dto/registerRequest.input';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { RateLimit } from '@backend/infrastructure';
import { GraphQLString } from 'graphql/type';
import { AuthUser } from '../authUser/authUser.entity';
import { AuditService, InjectAuditService } from '@backend/auditService';
import { DeleteUserRequest } from './dto/deleteUserRequest.input';
import { randomUUID } from 'node:crypto';
import { GraphQLVoid } from 'graphql-scalars';
import { SignedUpUser } from '../authUser/signedUpUser.entity';
import { userSession } from './interfaces/inrefaces';

@Resolver(() => AuthUser)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @InjectAuditService('auth') private readonly auditService: AuditService,
  ) {}

  @Mutation(() => SignedUpUser)
  async register(
    @Args('registerRequest') registerRequest: RegisterRequest,
  ): Promise<SignedUpUser> {
    const signUpResult = await this.authService.registerUser(registerRequest);
    const user = {
      id: signUpResult.id,
      email: registerRequest.email,
    };
    await this.sendAuditLog(user, 'registration');
    return user;
  }

  @Mutation(() => AuthUser)
  @RateLimit({
    errorMessage: 'Too many login attempts. Please try again later.',
  })
  async login(
    @Args('authenticateRequest') authenticateRequest: AuthenticateRequest,
  ): Promise<AuthUser> {
    try {
      const res = await this.authService.authenticateUser(authenticateRequest);
      return {
        id: res.id,
        email: authenticateRequest.username,
        jwt: res.jwt,
        refreshToken: res.refreshToken,
        isValid: res.isValid,
      };
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => AuthUser)
  async confirm(
    @Args('confirmUserRequest') confirmUserRequest: ConfirmUserRequest,
  ): Promise<userSession> {
    try {
      return await this.authService.confirmUser(confirmUserRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => GraphQLString)
  async sendConfirmationCode(
    @Args('email', { type: () => String }) email: string,
  ): Promise<string> {
    try {
      return await this.authService.sendConfirmationCode(email);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => GraphQLString)
  async delete(
    @Args('deleteUserRequest') deleteUserRequest: DeleteUserRequest,
  ): Promise<string> {
    try {
      const res = await this.authService.deleteUser(deleteUserRequest);
      await this.sendAuditLog(deleteUserRequest as AuthUser, 'delete');
      return res;
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  private async sendAuditLog(user: any, eventType: string): Promise<string> {
    return this.auditService.auditEvent({
      trigger: {
        id: { type: 'email', value: user.username },
        type: 'External',
      },
      subject: {
        type: 'auth',
        id: `${user.id ?? randomUUID()}`,
        event: {
          type: eventType,
          metaData: { user },
        },
      },
    });
  }
}
