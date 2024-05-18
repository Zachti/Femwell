import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdatePostInput {
  @Field(() => GraphQLUUID, {
    description: 'The id of the post itself',
  })
  id!: string;

  @Field(() => GraphQLString, {
    description: 'The new content of the post',
  })
  content!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user',
  })
  userId!: string;
}
