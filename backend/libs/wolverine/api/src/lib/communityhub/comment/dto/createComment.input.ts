import { Field, InputType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateCommentInput extends PickType(Comment, [
  'content',
  'postId',
  'userId',
]) {
  @Field(() => GraphQLString)
  username!: string;
}
