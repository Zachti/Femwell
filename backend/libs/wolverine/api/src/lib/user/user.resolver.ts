import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput, User } from '../index';
import { GraphQLUUID } from 'graphql-scalars';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return await this.userService.createUser(createUserInput);
  }

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
