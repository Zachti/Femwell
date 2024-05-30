import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateOrDeleteLikeInput {
  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLUUID)
  postId!: string;
}
