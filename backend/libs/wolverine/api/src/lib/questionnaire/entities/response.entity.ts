import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@ObjectType()
export class Response {
  @Field(() => GraphQLString)
  question!: string;

  @Field(() => GraphQLString)
  response!: string;
}
