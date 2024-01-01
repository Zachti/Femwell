import { InputType, Field } from '@nestjs/graphql';
import { QuestionAnswerInput } from './questionAnswers.input';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => [QuestionAnswerInput], { description: 'Array of question and answer pairs' })
  responses!: QuestionAnswerInput[];
}
