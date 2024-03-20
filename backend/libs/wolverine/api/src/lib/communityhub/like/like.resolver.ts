import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from '../../index';
import { CreateLikeInput } from '../../index';
import { GraphQLUUID, GraphQLPositiveInt } from 'graphql-scalars';
import { Role, Roles } from '@backend/infrastructure';
import { UsePipes } from '@nestjs/common';
import { ValidateInputPipe } from '../../shared/pipes/validateInput.pipe';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @UsePipes(new ValidateInputPipe())
  @Mutation(() => Like)
  async createLike(
    @Args('createLikeInput')
    createLikeInput: CreateLikeInput,
  ) {
    return await this.likeService.createLike(createLikeInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Boolean)
  async deleteLike(
    @Args('postId', { type: () => GraphQLUUID }) postId: string,
    @Args('userId', { type: () => GraphQLUUID }) userId: string,
  ) {
    return await this.likeService.deleteLike(postId, userId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [Like])
  async getLikes(@Args('postId', { type: () => GraphQLUUID }) postId: string) {
    return await this.likeService.getLikes(postId);
  }
}
