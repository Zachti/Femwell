import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { Response } from '../entities/response.entity';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => [Response], {
    description:
      'Array of object that contains the questions and the answers in order',
  })
  responses!: Response[];
}
