import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
@InputType()
export class QuestionAnswerInput {
  @Field(() => GraphQLString, { description: 'Question text' })
  question!: string;

  @Field(() => GraphQLString, { description: 'User response (yes, no or short sentence)' })
  answer!: string;
}
