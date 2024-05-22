import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';
import { ResponseInput } from './createResponse.input';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => [ResponseInput])
  responses!: ResponseInput[];
}
