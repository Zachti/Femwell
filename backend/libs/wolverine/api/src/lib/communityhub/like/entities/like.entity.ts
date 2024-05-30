import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID, GraphQLPositiveInt } from 'graphql-scalars';

@ObjectType()
export class Like {
  @Field(() => GraphQLPositiveInt)
  id!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLUUID)
  postId!: string;
}
