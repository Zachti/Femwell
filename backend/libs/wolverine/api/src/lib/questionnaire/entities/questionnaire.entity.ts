import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { Response } from './response.entity';

@ObjectType()
export class Questionnaire {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLUUID)
  userId!: string;

  @Field(() => [Response])
  responses!: Response[];
}
