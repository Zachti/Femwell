import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateLikeInput {
  @Field(() => GraphQLString, {
    description: 'The username of the user',
  })
  username!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the post',
  })
  postId!: string;
}
