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

@Resolver(() => AuthUser)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @InjectAuditService('auth') private readonly auditService: AuditService,
  ) {}

  @Mutation(() => AuthUser)
  async register(@Args('registerRequest') registerRequest: RegisterRequest) {
    const signUpResult = await this.authService.registerUser(registerRequest);
    const user = {
      id: signUpResult.id,
      username: registerRequest.email,
      jwt: signUpResult.jwt,
      refreshToken: signUpResult.refreshToken,
      isValid: signUpResult.isValid,
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
  ) {
    try {
      const res = await this.authService.authenticateUser(authenticateRequest);
      return {
        id: res.id,
        username: authenticateRequest.username,
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
  ) {
    try {
      const res = await this.authService.confirmUser(confirmUserRequest);
      return {
        id: res.id,
        email: confirmUserRequest.email,
        jwt: res.jwt,
        refreshToken: res.refreshToken,
        isValid: res.isValid,
      };
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
    @Args('confirmUserRequest') confirmUserRequest: ConfirmUserRequest,
  ): Promise<string> {
    try {
      return await this.authService.deleteUser(confirmUserRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  private async sendAuditLog(
    user: AuthUser,
    eventType: string,
  ): Promise<string> {
    return this.auditService.auditEvent({
      trigger: {
        id: { type: 'email', value: user.username },
        type: 'External',
      },
      subject: {
        type: 'auth',
        id: `${user.id}`,
        event: {
          type: eventType,
          metaData: { user },
        },
      },
    });
  }
}
