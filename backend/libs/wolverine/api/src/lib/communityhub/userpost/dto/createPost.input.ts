import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreatePostInput {
  @Field(() => GraphQLString)
  username!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  userId!: string;
}
