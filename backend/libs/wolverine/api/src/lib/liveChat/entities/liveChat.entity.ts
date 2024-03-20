import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';
import { Message } from './message.entity';
import { User } from '../../shared/user/entities/user.entity';

@ObjectType()
export class LiveChat {
  @Field(() => ID)
  id!: string;

  @Field(() => GraphQLString, { nullable: true })
  name!: string;

  @Field(() => GraphQLDate)
  createdAt!: Date;

  @Field(() => GraphQLDate, { nullable: true })
  updatedAt?: Date;

  @Field(() => [User]) // array of users that have joined the livechat
  users: User[];

  @Field(() => [Message], { nullable: true }) // array of messages
  messages?: Message[];
}
