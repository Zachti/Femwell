import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@ObjectType()
export class Response {
  @Field(() => [GraphQLString])
  Questions!: string[];

  @Field(() => [GraphQLString])
  responses!: string[];
}
