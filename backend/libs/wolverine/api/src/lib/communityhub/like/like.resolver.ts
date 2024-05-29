import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from '../../index';
import { CreateOrDeleteLikeInput } from '../../index';
import { GraphQLUUID } from 'graphql-scalars';
import { Role, Roles } from '@backend/infrastructure';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Like)
  async createLike(
    @Args('CreateOrDeleteLikeInput')
    createLikeInput: CreateOrDeleteLikeInput,
  ) {
    return await this.likeService.createLike(createLikeInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Boolean)
  async deleteLike(
    @Args('CreateOrDeleteLikeInput')
    deleteLikeInput: CreateOrDeleteLikeInput,
  ) {
    return await this.likeService.deleteLike(deleteLikeInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [Like])
  async getLikes(@Args('postId', { type: () => GraphQLUUID }) postId: string) {
    return await this.likeService.getLikes(postId);
  }
}
