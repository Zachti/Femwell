import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLDate, GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateEventInput {
  @Field(() => GraphQLString)
  title!: string;

  @Field(() => GraphQLDate)
  date!: Date;

  @Field(() => GraphQLString)
  duration!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => GraphQLString, { nullable: true })
  info?: string;
}
