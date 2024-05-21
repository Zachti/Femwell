import { InputType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(Comment, [
  'content',
  'postId',
  'userId',
  'username',
]) {}
