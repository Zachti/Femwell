import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLUUID } from 'graphql-scalars';
import { Response } from '../entities/response.entity';

@InputType()
export class CreateQuestionnaireInput {
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => [Response])
  responses!: Response[];
}
