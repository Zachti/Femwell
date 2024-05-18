import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreatePostInput {
  @Field(() => GraphQLString, {
    description: 'The username of the user',
  })
  username!: string;

  @Field(() => GraphQLString, {
    description: 'The content of the post',
  })
  content!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;
}
