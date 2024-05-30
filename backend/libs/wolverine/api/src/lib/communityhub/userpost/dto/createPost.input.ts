import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreatePostInput {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLString, { nullable: true })
  imageUrl?: string;

  @Field(() => Boolean, { nullable: true })
  isAnonymous?: boolean;

  @Field(() => GraphQLUUID, { nullable: true })
  mentionedUserId?: string;
}
