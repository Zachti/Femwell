import { InputType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@InputType()
export class UpdateCommentInput extends PickType(Comment, [
  'id',
  'content',
  'postId',
]) {}
