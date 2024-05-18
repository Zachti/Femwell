import { InputType, Field } from '@nestjs/graphql';
import { GraphQLPositiveInt, GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdateCommentInput {
  @Field(() => GraphQLPositiveInt, {
    description: 'The id of the comment',
  })
  id!: number;

  @Field(() => GraphQLString, {
    description: 'The new content of the comment',
  })
  content!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the post',
  })
  postId!: string;
}
