import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from '../../index';
import { CreateCommentInput, UpdateCommentInput } from '../../index';
import { GraphQLUUID, GraphQLPositiveInt } from 'graphql-scalars';
import { Role, Roles } from '@backend/infrastructure';
import { UsePipes } from '@nestjs/common';
import { ValidateInputPipe } from '../../shared/pipes/validateInput.pipe';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @UsePipes(new ValidateInputPipe())
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput')
    createCommentInput: CreateCommentInput,
  ) {
    return await this.commentService.createComment(createCommentInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @UsePipes(new ValidateInputPipe())
  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return await this.commentService.updateComment(updateCommentInput);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Mutation(() => Comment)
  async deleteComment(
    @Args('id', { type: () => GraphQLPositiveInt }) id: number,
    @Args('userId', { type: () => GraphQLUUID }) userId: string,
  ) {
    return await this.commentService.deleteComment(id, userId);
  }

  @Roles([Role.Padulla, Role.Premium, Role.User])
  @Query(() => [Comment])
  async getComments(
    @Args('postId', { type: () => GraphQLUUID }) postId: string,
  ) {
    return await this.commentService.getComments(postId);
  }
}
