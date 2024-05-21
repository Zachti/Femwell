import { InputType, Field, PickType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { Questionnaire } from '../entities/questionnaire.entity';

@InputType()
export class CreateQuestionnaireInput extends PickType(Questionnaire, [
  'userId',
  'responses',
]) {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;
}
