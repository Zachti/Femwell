import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';
import { LiveChat } from './liveChat.entity';
@ObjectType()
export class Message {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => GraphQLString, { nullable: true })
  content?: string;

  @Field(() => GraphQLDate, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLDate, { nullable: true })
  updatedAt?: Date;

  @Field(() => LiveChat, { nullable: true }) // array of user IDs
  liveChat?: LiveChat;

  @Field(() => ID, { nullable: true }) // sender ID
  userId?: string;
}
