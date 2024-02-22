import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';
import {
  Post,
  Comment,
  Like,
  Questionnaire,
  LiveChat,
  Message,
} from '../../../index';

@ObjectType()
export class User {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  likes?: Like[];

  @Field(() => Questionnaire, { nullable: true })
  questionnaire?: Questionnaire;

  @Field(() => [LiveChat], { nullable: true })
  liveChats?: LiveChat[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}
