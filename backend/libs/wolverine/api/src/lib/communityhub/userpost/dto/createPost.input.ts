import { Field, InputType, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreatePostInput extends PickType(Post, ['content', 'userId']) {
  @Field(() => GraphQLString)
  username!: string;
}
