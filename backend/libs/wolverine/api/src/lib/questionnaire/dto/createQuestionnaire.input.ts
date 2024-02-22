import { InputType, Field } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { ResponseInput } from './createResponse.input';
import { IsString, IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateQuestionnaireInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, { description: 'Username of the respondent' })
  username!: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the respondent',
  })
  userId!: string;

  @IsArray()
  @IsNotEmpty()
  @Field(() => [ResponseInput], {
    description:
      'Array of objects that contain the questions and the answers in order',
  })
  responses!: ResponseInput[];
}
