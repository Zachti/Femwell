import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateCommentInput {
  @Field(() => GraphQLString)
  username!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLUUID)
  postId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  mentionedUserId?: string;
}
