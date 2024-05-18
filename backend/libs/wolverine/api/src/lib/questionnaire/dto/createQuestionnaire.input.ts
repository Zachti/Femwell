import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { ResponseInput } from './createResponse.input';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => GraphQLUUID, {
    description: 'The unique id of the respondent',
  })
  userId!: string;

  @Field(() => [ResponseInput], {
    description:
      'Array of objects that contain the questions and the answers in order',
  })
  responses!: ResponseInput[];
}
