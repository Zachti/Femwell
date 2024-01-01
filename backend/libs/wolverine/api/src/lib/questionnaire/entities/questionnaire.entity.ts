import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { QuestionAnswerInput } from '../dto/questionAnswers.input';
import { GraphQLUUID } from 'graphql-scalars';

@ObjectType()
export class Questionnaire {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => [QuestionAnswerInput])
  responses!: QuestionAnswerInput[];
}
