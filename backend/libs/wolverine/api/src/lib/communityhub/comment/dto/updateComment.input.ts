import { Field, InputType } from '@nestjs/graphql';
import { GraphQLPositiveInt, GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class UpdateCommentInput {
  @Field(() => GraphQLPositiveInt)
  id!: number;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  postId!: string;

  @Field(() => GraphQLString, { nullable: true })
  userProfilePic?: string;
}
