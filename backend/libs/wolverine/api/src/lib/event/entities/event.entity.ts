import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLDate } from 'graphql-scalars';

@ObjectType()
export class Event {
  @Field(() => Int)
  id!: number;

  @Field(() => GraphQLString)
  title!: string;

  @Field(() => GraphQLDate)
  date!: Date;

  @Field(() => GraphQLString)
  duration!: string;

  @Field(() => GraphQLString)
  userId!: string;

  @Field(() => GraphQLString)
  info?: string;
}
