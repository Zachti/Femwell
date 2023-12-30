import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterRequest } from './dto/registerRequest.entity';
import { AuthenticateRequest } from './dto/authenticateRequest.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@backend/vault';
import { ConfirmUserRequest } from './dto/confirmUserRequest.entity';
import { GraphQLVoid } from 'graphql-scalars';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => GraphQLVoid)
  async register(@Args('registerRequest') registerRequest: RegisterRequest) {
    return await this.authService.registerUser(registerRequest);
  }

  @Mutation(() => GraphQLVoid)
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
}
