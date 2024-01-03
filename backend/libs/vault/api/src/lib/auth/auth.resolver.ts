import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterRequest } from './dto/registerRequest.input';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@backend/vault';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { GraphQLVoid } from 'graphql-scalars';
import { CognitoUserSession, ISignUpResult } from 'amazon-cognito-identity-js';
import { RateLimit } from '@backend/infrastructure';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Promise<ISignUpResult>)
  async register(@Args('registerRequest') registerRequest: RegisterRequest) {
    return await this.authService.registerUser(registerRequest);
  }

  @Mutation(() => Promise<CognitoUserSession>)
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

  @Mutation(() => GraphQLVoid)
  async confirm(
    @Args('confirmUserRequest') confirmUserRequest: ConfirmUserRequest,
  ) {
    try {
      return await this.authService.confirmUser(confirmUserRequest);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Mutation(() => GraphQLVoid)
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
