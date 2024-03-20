import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID, GraphQLPositiveInt } from 'graphql-scalars';

@ObjectType()
export class Comment {
  @Field(() => GraphQLPositiveInt)
  id!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLUUID)
  postId!: string;
}
