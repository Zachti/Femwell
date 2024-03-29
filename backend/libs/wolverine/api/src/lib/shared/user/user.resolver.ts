import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../index';
import { CreateUserInput, UpdateUserInput } from '../../index';
import { GraphQLUUID } from 'graphql-scalars';
import { UsePipes } from '@nestjs/common';
import { ValidateInputPipe } from '../pipes/validateInput.pipe';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidateInputPipe())
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return await this.userService.createUser(createUserInput);
  }

  @UsePipes(new ValidateInputPipe())
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateUser(updateUserInput);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return await this.userService.deleteUser(id);
  }

  @Query(() => [User], { name: 'allUsers' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'oneUser' })
  async findOne(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return await this.userService.findOne(id);
  }
}
