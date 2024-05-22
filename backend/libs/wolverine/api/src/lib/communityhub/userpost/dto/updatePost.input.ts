import { Field, InputType, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class UpdatePostInput extends PickType(Post, ['content', 'userId']) {
  @Field(() => GraphQLUUID)
  id!: string;
}
