import { InputType, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@InputType()
export class UpdatePostInput extends PickType(Post, [
  'id',
  'content',
  'userId',
]) {}
