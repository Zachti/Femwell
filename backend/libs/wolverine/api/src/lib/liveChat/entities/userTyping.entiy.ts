import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLPositiveInt, GraphQLUUID } from 'graphql-scalars';

@ObjectType()
export class UserTyping {
  @Field(() => GraphQLUUID, { nullable: true })
  userId?: string;

  @Field(() => GraphQLPositiveInt, { nullable: true })
  liveChatId?: number;
}

@ObjectType()
export class UserStoppedTyping extends UserTyping {}
