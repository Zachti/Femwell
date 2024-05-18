import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateCommentInput {
  @Field(() => GraphQLString, {
    description: 'The username of the user',
  })
  username!: string;

  @Field(() => GraphQLString, {
    description: 'The content of the comment',
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
