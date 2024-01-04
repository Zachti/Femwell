import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterRequest } from './dto/registerRequest.input';
import { AuthenticateRequest } from './dto/authenticateRequest.input';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmUserRequest } from './dto/confirmUserRequest.input';
import { RateLimit } from '@backend/infrastructure';
import { GraphQLString } from 'graphql/type';
import { AuthUser } from '../authUser/authUser.entity';

@Resolver(() => AuthUser)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthUser)
  async register(@Args('registerRequest') registerRequest: RegisterRequest) {
    const signUpResult = await this.authService.registerUser(registerRequest);
    return {
      username: registerRequest.email,
      jwt: signUpResult.jwt,
      refreshToken: signUpResult.refreshToken,
      isValid: signUpResult.isValid,
    }
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
        username: authenticateRequest.username,
        jwt: res.jwt,
        refreshToken: res.refreshToken,
        isValid: res.isValid,
      }
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
        email: confirmUserRequest.email,
        jwt: res.jwt,
        refreshToken: res.refreshToken,
        isValid: res.isValid,
      }
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
