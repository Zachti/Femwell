import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterRequest } from './dto/registerRequest.input';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@backend/vault';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { RateLimit } from '@backend/infrastructure';
import { GraphQLString } from 'graphql/type';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CognitoUser)
  async register(@Args('registerRequest') registerRequest: RegisterRequest) {
    return await this.authService.registerUser(registerRequest);
  }

  @Mutation(() => CognitoUserSession)
  @RateLimit({
    errorMessage: 'Too many login attempts. Please try again later.',
  })
  async login(
    @Args('authenticateRequest') authenticateRequest: AuthenticateRequest,
  ) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => CognitoUser)
  async confirm(
    @Args('confirmUserRequest') confirmUserRequest: ConfirmUserRequest,
  ) {
    try {
      return await this.authService.confirmUser(confirmUserRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => GraphQLString)
  async sendConfirmationCode(
    @Args('email', { type: () => String }) email: string,
  ) {
    try {
      return await this.authService.sendConfirmationCode(email);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => GraphQLString)
  async delete(
    @Args('confirmUserRequest') confirmUserRequest: ConfirmUserRequest,
  ) {
    try {
      return await this.authService.deleteUser(confirmUserRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
