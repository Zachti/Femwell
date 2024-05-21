import { InputType, PickType } from '@nestjs/graphql';
import { Like } from '../entities/like.entity';

@InputType()
export class CreateLikeInput extends PickType(Like, [
  'username',
  'postId',
  'userId',
]) {}
