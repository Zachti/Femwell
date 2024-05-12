import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLDate, GraphQLPositiveInt } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';
import { LiveChat } from './liveChat.entity';
import { User } from '../../shared/user/entities/user.entity';
@ObjectType()
export class Message {
  @Field(() => GraphQLPositiveInt)
  id!: string;

  @Field(() => GraphQLString)
  content!: string;

  @Field(() => GraphQLDate)
  createdAt!: Date;

  @Field(() => GraphQLDate, { nullable: true })
  updatedAt?: Date;

  @Field(() => LiveChat) // array of user IDs
  liveChat!: LiveChat;

  @Field(() => ID) // sender ID
  userId!: string;

  @Field(() => User)
  user!: User;

  @Field(() => Boolean, { defaultValue: false })
  seen!: boolean;
}
