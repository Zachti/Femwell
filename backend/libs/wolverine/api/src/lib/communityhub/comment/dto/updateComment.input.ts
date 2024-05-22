import { Field, InputType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';
import { GraphQLPositiveInt } from 'graphql-scalars';

@InputType()
export class UpdateCommentInput extends PickType(Comment, [
  'content',
  'postId',
]) {
  @Field(() => GraphQLPositiveInt)
  id!: number;
}
