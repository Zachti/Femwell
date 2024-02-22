import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@ObjectType()
export class Response {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  question!: string;

  @Field(() => GraphQLString, { nullable: true })
  answer?: string;

  @Field(() => GraphQLString)
  questionnaireId!: string;
}
