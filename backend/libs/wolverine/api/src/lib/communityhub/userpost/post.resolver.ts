import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from '../../index';
import { CreatePostInput, UpdatePostInput } from '../../index';
import { GraphQLUUID } from 'graphql-scalars';
import { Role, Roles } from '@backend/infrastructure';
import { UsePipes } from '@nestjs/common';
import { ValidateInputPipe } from '../../shared/pipes/validateInput.pipe';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @UsePipes(new ValidateInputPipe())
  @Mutation(() => Post)
  async createPost(
    @Args('createPostInput')
    createPostInput: CreatePostInput,
  ) {
    return await this.postService.createPost(createPostInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @UsePipes(new ValidateInputPipe())
  @Mutation(() => Post)
  async updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return await this.postService.updatePost(updatePostInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Post)
  async deletePost(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return await this.postService.deletePost(id);
  }
}
