import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserTyping {
  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => ID, { nullable: true })
  liveChatId?: number;
}

@ObjectType()
export class UserStoppedTyping extends UserTyping {}
