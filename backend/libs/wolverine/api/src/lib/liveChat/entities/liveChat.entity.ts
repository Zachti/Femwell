import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';
import { Message } from './message.entity';

@ObjectType()
export class LiveChat {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => GraphQLString, { nullable: true })
  name?: string;

  @Field(() => GraphQLDate, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLDate, { nullable: true })
  updatedAt?: Date;

  @Field(() => [ID], { nullable: true }) // array of user IDs for padulla id and client id
  usersIds?: string[];

  @Field(() => [Message], { nullable: true }) // array of messages
  messages?: Message[];
}
