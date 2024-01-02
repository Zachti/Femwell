import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => GraphQLString, {
    description: 'Array of answers in order',
  })
  responses!: string[];
}
